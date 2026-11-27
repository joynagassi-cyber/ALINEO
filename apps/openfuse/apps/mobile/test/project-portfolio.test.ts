import assert from "node:assert/strict";
import test from "node:test";
import type { AgentTask, Goal } from "../../../packages/domain/src/agent";
import { prioritizeProjects, projectProgress } from "../src/project-portfolio";

function project(milestones: Goal["milestones"], overrides: Partial<Goal> = {}): Goal {
  return {
    id: "project-1",
    title: "Projet test",
    description: "Résultat attendu",
    category: "Projet",
    kind: "project",
    status: "active",
    milestones,
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}
function task(
  id: string,
  status: AgentTask["status"],
  overrides: Partial<AgentTask> = {},
): AgentTask {
  return {
    id,
    title: `Tâche ${id}`,
    prompt: "",
    kind: "plan",
    status,
    plan: [],
    evidence: [],
    input: {},
    state: {},
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
    attempts: 0,
    artifactIds: [],
    ...overrides,
  };
}

test("portfolio progression counts recorded milestones and independent tasks without duplication", () => {
  const goal = project([
    { id: "m1", title: "Préparer", done: false },
    { id: "m2", title: "Lancer", done: true },
  ]);
  const result = projectProgress(goal, [
    task("task-m1", "succeeded", { goalId: goal.id, milestoneId: "m1" }),
    task("task-extra", "running", { goalId: goal.id }),
    task("task-closed", "succeeded", { goalId: goal.id }),
    task("unrelated", "succeeded", { goalId: "another-project" }),
  ]);

  assert.equal(result.totalMilestones, 2);
  assert.equal(result.completedMilestones, 1);
  assert.equal(result.totalUnits, 4);
  assert.equal(result.completedUnits, 2);
  assert.equal(result.percent, 50);
  assert.equal(result.activeTasks.length, 1);
  assert.equal(result.tasks.length, 3);
});

test("a task published as a completed milestone is measured only once", () => {
  const goal = project([{ id: "task-done", title: "Rapport livré", done: true }]);
  const result = projectProgress(goal, [task("task-done", "succeeded", { goalId: goal.id })]);

  assert.equal(result.totalUnits, 1);
  assert.equal(result.completedUnits, 1);
  assert.equal(result.percent, 100);
});

test("waiting and failed tasks are explicit blockers and never count as complete", () => {
  const goal = project([{ id: "m1", title: "Valider le budget", done: false }]);
  const blocked = task("task-waiting", "waiting_input", {
    goalId: goal.id,
    milestoneId: "m1",
    title: "Rassembler les chiffres",
  });
  const result = projectProgress(goal, [blocked]);

  assert.equal(result.percent, 0);
  assert.deepEqual(
    result.blockedTasks.map((item) => item.id),
    [blocked.id],
  );
  assert.equal(result.nextStep, "Débloquer « Rassembler les chiffres ».");
});

test("projects without recorded milestones or tasks are unmeasured, not zero-percent", () => {
  const result = projectProgress(project([]), []);

  assert.equal(result.totalUnits, 0);
  assert.equal(result.percent, null);
  assert.match(result.nextStep, /Ajouter un premier jalon/);
});

test("portfolio prioritization puts evidenced blockers ahead of work in progress", () => {
  const runningProject = project([{ id: "m2", title: "Étape", done: false }], {
    id: "project-running",
    title: "En cours",
  });
  const blockedProject = project([{ id: "m3", title: "Étape", done: false }], {
    id: "project-blocked",
    title: "Bloqué",
  });
  const running = projectProgress(runningProject, [
    task("running", "running", { goalId: runningProject.id }),
  ]);
  const blocked = projectProgress(blockedProject, [
    task("blocked", "failed", { goalId: blockedProject.id }),
  ]);

  assert.deepEqual(
    prioritizeProjects([running, blocked]).map((item) => item.project.id),
    [blockedProject.id, runningProject.id],
  );
});
