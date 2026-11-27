import { Activity, ArrowRight, Bell, Clock3, ListChecks, RefreshCw } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import type { Section } from "../../../packages/domain/src";
import type {
  AgentNotification,
  AgentTask,
  AgentWorkspace,
  TaskStatus,
} from "../../../packages/domain/src/agent";
import type { MicOrbState } from "./mic-orb";
import {
  Button,
  Card,
  Chip,
  colors,
  Empty,
  ErrorNotice,
  Heading,
  LoadingNotice,
  Mascot,
  relativeDate,
  resultSummary,
  SectionHeading,
  Sheet,
  s,
} from "./ui";
import { useWorkspace } from "./workspace";

const taskStatusLabels: Record<TaskStatus, string> = {
  queued: "Dans la file d’attente",
  running: "En cours",
  waiting_approval: "À valider",
  waiting_input: "Votre réponse est attendue",
  scheduled: "Programmée",
  paused: "En pause",
  succeeded: "Terminée",
  failed: "À examiner",
  cancelled: "Annulée",
};
const taskStatusTints: Record<TaskStatus, string> = {
  queued: colors.sky,
  running: colors.sky,
  waiting_approval: colors.lavender,
  waiting_input: colors.orange,
  scheduled: colors.canvas,
  paused: colors.canvas,
  succeeded: colors.green,
  failed: colors.errorSurface,
  cancelled: colors.canvas,
};
const activeStatuses = new Set<TaskStatus>([
  "queued",
  "running",
  "waiting_approval",
  "waiting_input",
  "scheduled",
  "paused",
]);

function timeValue(value: string) {
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : 0;
}
function newestFirst<T extends { updatedAt?: string; createdAt?: string }>(items: T[]) {
  return [...items].sort(
    (a, b) =>
      timeValue(b.updatedAt || b.createdAt || "") - timeValue(a.updatedAt || a.createdAt || ""),
  );
}
function notificationTime(notification: AgentNotification) {
  return timeValue(notification.createdAt);
}
function progressLabel(complete: number, total: number) {
  return `${complete} étape${complete > 1 ? "s" : ""} terminée${complete > 1 ? "s" : ""} sur ${total}`;
}
function taskPriority(task: AgentTask) {
  const priorities: Record<TaskStatus, number> = {
    waiting_input: 0,
    waiting_approval: 1,
    running: 2,
    queued: 3,
    paused: 4,
    scheduled: 5,
    failed: 6,
    succeeded: 7,
    cancelled: 8,
  };
  return priorities[task.status];
}
function describeActivity(
  activeTask: AgentTask | undefined,
  latestTask: AgentTask | undefined,
  data: AgentWorkspace | undefined,
  chatReplying: boolean,
  error: string,
) {
  if (activeTask?.status === "waiting_input") return "Alineo attend vos indications";
  if (activeTask?.status === "waiting_approval") return "À vérifier avant de continuer";
  if (chatReplying) return "Alineo répond dans le chat";
  if (activeTask?.status === "running") return "Alineo travaille";
  if (activeTask?.status === "queued") return "Une tâche attend son démarrage";
  if (activeTask?.status === "paused") return "Une tâche est en pause";
  if (activeTask?.status === "scheduled") return "Une tâche est programmée";
  if (error) return "Activité temporairement indisponible";
  if (!data) return "Vérification de l’activité d’Alineo";
  if (latestTask?.status === "failed") return "Une tâche nécessite votre attention";
  if (latestTask?.status === "succeeded") return "Votre dernière tâche est terminée";
  if (!data.worker.running) return "Les tâches en arrière-plan sont en pause";
  return "Alineo est prête";
}
function getOrbState(
  activeTask: AgentTask | undefined,
  latestTask: AgentTask | undefined,
  data: AgentWorkspace | undefined,
  chatReplying: boolean,
): MicOrbState {
  if (activeTask?.status === "waiting_input") return "listening";
  if (activeTask?.status === "waiting_approval") return "done";
  if (chatReplying || activeTask?.status === "running" || activeTask?.status === "queued")
    return "thinking";
  if (!activeTask && data && latestTask?.status === "succeeded") return "finished";
  return "idle";
}
function statusColor(
  activeTask: AgentTask | undefined,
  latestTask: AgentTask | undefined,
  data: AgentWorkspace | undefined,
  error: string,
) {
  if (error) return colors.danger;
  if (activeTask?.status === "waiting_input" || activeTask?.status === "waiting_approval")
    return colors.warning;
  if (activeTask?.status === "running" || activeTask?.status === "queued") return colors.accentDark;
  if (activeTask) return colors.muted;
  if (latestTask?.status === "failed") return colors.danger;
  if (!data?.worker.running) return colors.muted;
  return colors.accentDark;
}
function TaskActivityCard({ task, onPress }: { task: AgentTask; onPress: () => void }) {
  const [focused, setFocused] = useState(false);
  const complete = task.plan.filter((step) => step.status === "succeeded").length;
  const total = task.plan.length;
  const currentStep = task.plan.find(
    (step) => step.status === "running" || step.status === "waiting",
  );
  const detail =
    task.question || task.error || currentStep?.detail || currentStep?.title || task.result;
  const accessibilityLabel = [
    `Ouvrir la tâche : ${task.title}`,
    taskStatusLabels[task.status],
    total ? progressLabel(complete, total) : "",
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Afficher le plan, les dernières activités et le résultat de cette tâche."
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={onPress}
      style={({ pressed }) => ({
        padding: 2,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: focused ? colors.focus : "transparent",
        opacity: pressed ? 0.92 : 1,
      })}
    >
      <Card style={{ padding: 16, gap: 10, borderRadius: 18, backgroundColor: colors.card }}>
        <View style={[s.between, { alignItems: "flex-start", gap: 12 }]}>
          <View style={{ flex: 1, minWidth: 0, gap: 5 }}>
            <Text style={s.heading}>{task.title}</Text>
            <Text style={s.small}>Mis à jour {relativeDate(task.updatedAt)}</Text>
          </View>
          <Chip tint={taskStatusTints[task.status]}>{taskStatusLabels[task.status]}</Chip>
        </View>
        {!!total && (
          <View style={{ gap: 6 }}>
            <View
              accessibilityRole="progressbar"
              accessibilityLabel={progressLabel(complete, total)}
              accessibilityValue={{ min: 0, max: total, now: complete }}
              style={{
                height: 5,
                borderRadius: 4,
                overflow: "hidden",
                backgroundColor: colors.line,
              }}
            >
              <View
                style={{
                  width: `${Math.round((complete / total) * 100)}%`,
                  height: 5,
                  backgroundColor: colors.accentDark,
                  borderRadius: 4,
                }}
              />
            </View>
            <Text style={s.small}>
              {progressLabel(complete, total)}
              {currentStep ? ` · ${currentStep.title}` : ""}
            </Text>
          </View>
        )}
        {!!detail && (
          <Text
            numberOfLines={3}
            style={[s.muted, task.status === "failed" && { color: colors.danger }]}
          >
            {resultSummary(detail)}
          </Text>
        )}
        <View style={[s.row, { gap: 6, alignSelf: "flex-end" }]}>
          <Text style={[s.small, { color: colors.accentDark, fontWeight: "600" }]}>
            Voir les détails
          </Text>
          <ArrowRight size={14} color={colors.accentDark} />
        </View>
      </Card>
    </Pressable>
  );
}

export function MicOrbActivity({
  desktop,
  section,
  toastVisible,
  chatReplying,
  data,
  error,
  refresh,
}: {
  desktop: boolean;
  section: Section;
  toastVisible: boolean;
  chatReplying: boolean;
  data?: AgentWorkspace;
  error: string;
  refresh: () => Promise<void>;
}) {
  const { open, navigate } = useWorkspace();
  const [shown, setShown] = useState(false);
  const [focused, setFocused] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const allTasks = newestFirst(data?.tasks || []);
  const activeTasks = allTasks
    .filter((task) => activeStatuses.has(task.status))
    .sort(
      (a, b) =>
        taskPriority(a) - taskPriority(b) || timeValue(b.updatedAt) - timeValue(a.updatedAt),
    );
  const latestTask = allTasks[0];
  const foregroundTask = activeTasks[0];
  const displayedTasks = activeTasks.length
    ? activeTasks.slice(0, 3)
    : latestTask
      ? [latestTask]
      : [];
  const notifications = [...(data?.notifications || [])].sort(
    (a, b) => notificationTime(b) - notificationTime(a),
  );
  const latestNotification = notifications[0];
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const activityLabel = describeActivity(foregroundTask, latestTask, data, chatReplying, error);
  const orbState = getOrbState(foregroundTask, latestTask, data, chatReplying);
  const indicatorColor = statusColor(foregroundTask, latestTask, data, error);
  const badgeCount = unreadCount || activeTasks.length;
  const chatIsActive = section === "chat";
  const mobileChatOffset =
    !desktop && chatIsActive ? 164 : desktop && chatIsActive ? 112 : desktop ? 24 : 88;
  const bottom = mobileChatOffset + (toastVisible ? 60 : 0);
  const agentName = data?.identity.name || "Alineo";
  const appearance = data?.identity.micOrb;
  const avatar = data?.identity.avatar;

  async function reload() {
    setRefreshing(true);
    try {
      await refresh();
    } catch {
      // The agent workspace context retains and displays its latest error.
    } finally {
      setRefreshing(false);
    }
  }
  function openTask(taskId: string) {
    setShown(false);
    open({ type: "task", taskId });
  }
  function openActivity() {
    setShown(false);
    navigate("activity");
  }
  function openChat() {
    setShown(false);
    navigate("chat");
  }
  const badgeText = badgeCount > 99 ? "99+" : badgeCount;
  const buttonLabel = [
    `Ouvrir l’activité de ${agentName}`,
    activityLabel,
    activeTasks.length
      ? `${activeTasks.length} tâche${activeTasks.length > 1 ? "s" : ""} active${activeTasks.length > 1 ? "s" : ""}`
      : "aucune tâche active",
    unreadCount
      ? `${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`
      : "",
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <>
      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          right: desktop ? 26 : 16,
          bottom,
          zIndex: 40,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={buttonLabel}
          accessibilityHint="Consultez l’avancement des tâches, les dernières nouvelles et les points qui requièrent votre attention."
          accessibilityState={{
            expanded: shown,
            busy: chatReplying || activeTasks.some((task) => task.status === "running"),
          }}
          aria-expanded={Platform.OS === "web" ? shown : undefined}
          aria-controls={Platform.OS === "web" && shown ? "alineo-mic-orb-activity" : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onPress={() => setShown((current) => !current)}
          style={({ pressed }) => ({
            width: 68,
            height: 68,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 36,
            borderWidth: focused ? 3 : 2,
            borderColor: focused ? colors.focus : shown ? colors.accentDark : colors.line,
            backgroundColor: colors.card,
            shadowColor: "#000000",
            shadowOpacity: pressed ? 0.1 : 0.2,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 5 },
            elevation: 7,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          })}
        >
          <Mascot
            size={54}
            variant={avatar}
            state={orbState}
            appearance={appearance}
            accessible={false}
          />
          <View
            accessible={false}
            style={{
              position: "absolute",
              top: 3,
              right: 3,
              width: 13,
              height: 13,
              borderRadius: 7,
              backgroundColor: indicatorColor,
              borderWidth: 2,
              borderColor: colors.card,
            }}
          />
          {!!badgeCount && (
            <View
              accessible={false}
              style={{
                position: "absolute",
                top: -7,
                left: -5,
                minWidth: 21,
                height: 21,
                paddingHorizontal: 5,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 11,
                borderWidth: 2,
                borderColor: colors.card,
                backgroundColor: unreadCount ? colors.danger : colors.accentDark,
              }}
            >
              <Text style={{ color: colors.card, fontSize: 10, lineHeight: 13, fontWeight: "700" }}>
                {badgeText}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {shown && (
        <Sheet
          title="Activité d’Alineo"
          subtitle="L’avancement de votre assistant en direct"
          onClose={() => setShown(false)}
        >
          <View nativeID="alineo-mic-orb-activity" style={{ gap: 16 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                padding: 14,
                borderRadius: 18,
                backgroundColor: colors.sky,
              }}
            >
              <Mascot
                size={54}
                variant={avatar}
                state={orbState}
                appearance={appearance}
                accessible={false}
              />
              <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
                <Heading level={2} style={s.heading}>
                  {activityLabel}
                </Heading>
                <Text style={s.small}>
                  {data?.worker.running
                    ? "Les tâches en arrière-plan sont actives"
                    : data
                      ? "Les tâches en arrière-plan sont suspendues ; le chat reste disponible"
                      : "Vérification du dernier état"}
                </Text>
              </View>
              {!!activeTasks.length && (
                <Chip>
                  {activeTasks.length} tâche{activeTasks.length > 1 ? "s" : ""} active
                  {activeTasks.length > 1 ? "s" : ""}
                </Chip>
              )}
            </View>

            <ErrorNotice error={error ? `Les informations peuvent être obsolètes. ${error}` : ""} />
            {!data && !error && <LoadingNotice label="Vérification de l’activité d’Alineo…" />}
            {error && (
              <Button small icon={RefreshCw} busy={refreshing} onPress={() => void reload()}>
                Actualiser l’activité
              </Button>
            )}
            {chatReplying && (
              <Card style={{ padding: 16, gap: 7 }}>
                <View style={[s.row, { gap: 8 }]}>
                  <Activity size={17} color={colors.accentDark} />
                  <Text style={s.heading}>Réponse en cours dans le chat</Text>
                </View>
                <Text style={s.muted}>Alineo prépare une réponse à votre dernier message.</Text>
              </Card>
            )}

            {!!activeTasks.length && (
              <View style={{ gap: 10 }}>
                <SectionHeading
                  title="Tâches en cours"
                  action="Tout afficher"
                  onPress={openActivity}
                />
                {displayedTasks.map((task) => (
                  <TaskActivityCard key={task.id} task={task} onPress={() => openTask(task.id)} />
                ))}
                {activeTasks.length > displayedTasks.length && (
                  <Text style={[s.small, { textAlign: "center" }]}>
                    Encore {activeTasks.length - displayedTasks.length} tâche
                    {activeTasks.length - displayedTasks.length === 1 ? "" : "s"} active
                    {activeTasks.length - displayedTasks.length === 1 ? "" : "s"}.
                  </Text>
                )}
              </View>
            )}
            {!activeTasks.length && !chatReplying && displayedTasks.length > 0 && (
              <View style={{ gap: 10 }}>
                <SectionHeading title="Tâche la plus récente" />
                <TaskActivityCard
                  task={displayedTasks[0]}
                  onPress={() => openTask(displayedTasks[0].id)}
                />
              </View>
            )}
            {!activeTasks.length && !chatReplying && !displayedTasks.length && data && (
              <Empty
                icon={ListChecks}
                title="Aucune tâche en cours"
                detail="Alineo est prête. Lancez une tâche dans le chat ou consultez l’activité récente."
              >
                <Button primary onPress={openChat}>
                  Ouvrir le chat
                </Button>
              </Empty>
            )}

            {!!latestNotification && (
              <Card style={{ padding: 16, gap: 8 }}>
                <SectionHeading title="Dernière notification" />
                <View style={[s.row, { gap: 8, alignItems: "flex-start" }]}>
                  <Bell
                    size={16}
                    color={latestNotification.read ? colors.muted : colors.accentDark}
                  />
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={[s.text, { fontWeight: "600" }]}>{latestNotification.title}</Text>
                    <Text style={s.muted}>{latestNotification.body}</Text>
                    <Text style={s.small}>{relativeDate(latestNotification.createdAt)}</Text>
                  </View>
                </View>
                {!!latestNotification.taskId && (
                  <Button
                    small
                    style={{ alignSelf: "flex-start" }}
                    onPress={() => openTask(latestNotification.taskId || "")}
                  >
                    Ouvrir la tâche associée
                  </Button>
                )}
              </Card>
            )}

            <Button icon={Clock3} onPress={openActivity}>
              Voir toute l’activité
            </Button>
          </View>
        </Sheet>
      )}
    </>
  );
}
