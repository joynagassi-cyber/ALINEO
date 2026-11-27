import type { AgentTask, Goal } from "../../../packages/domain/src/agent";

const terminalStatuses = new Set<AgentTask["status"]>(["succeeded", "failed", "cancelled"]);
const blockingStatuses = new Set<AgentTask["status"]>([
  "failed",
  "waiting_approval",
  "waiting_input",
]);

export interface ProjectProgress {
  project: Goal;
  tasks: AgentTask[];
  activeTasks: AgentTask[];
  blockedTasks: AgentTask[];
  completedMilestones: number;
  totalMilestones: number;
  completedUnits: number;
  totalUnits: number;
  percent: number | null;
  nextStep: string;
}

/**
 * Measures only recorded milestones and standalone agent tasks. Completing a delegated
 * task does not silently complete its milestone; server-published milestone/task pairs count once.
 */
export function projectProgress(project: Goal, allTasks: AgentTask[]): ProjectProgress {
  const tasks = allTasks.filter((task) => task.goalId === project.id);
  const milestoneIds = new Set(project.milestones.map((milestone) => milestone.id));
  const independentTasks = tasks.filter((task) =>
    task.milestoneId ? !milestoneIds.has(task.milestoneId) : !milestoneIds.has(task.id),
  );
  const completedMilestones = project.milestones.filter((milestone) => milestone.done).length;
  const completedIndependentTasks = independentTasks.filter(
    (task) => task.status === "succeeded",
  ).length;
  const totalUnits = project.milestones.length + independentTasks.length;
  const completedUnits = completedMilestones + completedIndependentTasks;
  const activeTasks = tasks.filter((task) => !terminalStatuses.has(task.status));
  const blockedTasks = tasks.filter((task) => blockingStatuses.has(task.status));
  const nextMilestone = project.milestones.find((milestone) => !milestone.done);
  const nextStep =
    project.status === "completed"
      ? "Projet terminé."
      : project.status === "paused"
        ? "Projet en pause."
        : blockedTasks[0]
          ? `Débloquer « ${blockedTasks[0].title} ».`
          : activeTasks[0]
            ? `Suivre « ${activeTasks[0].title} ».`
            : nextMilestone
              ? `Prochaine étape enregistrée : ${nextMilestone.title}.`
              : totalUnits === 0
                ? "Ajouter un premier jalon ou confier une tâche à Alineo."
                : "Toutes les étapes enregistrées sont terminées.";

  return {
    project,
    tasks,
    activeTasks,
    blockedTasks,
    completedMilestones,
    totalMilestones: project.milestones.length,
    completedUnits,
    totalUnits,
    percent: totalUnits ? Math.round((completedUnits / totalUnits) * 100) : null,
    nextStep,
  };
}

/** Stable ordering: evidenced blockers first, then active work, then projects needing a start. */
export function prioritizeProjects(projects: ProjectProgress[]): ProjectProgress[] {
  const score = (progress: ProjectProgress) =>
    progress.project.status !== "active"
      ? 0
      : progress.blockedTasks.length
        ? 3
        : progress.activeTasks.length
          ? 2
          : progress.totalUnits > progress.completedUnits
            ? 1
            : 0;
  return [...projects].sort((a, b) => score(b) - score(a));
}
