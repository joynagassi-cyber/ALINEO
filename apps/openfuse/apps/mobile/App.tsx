import { CopilotKitProvider } from "@copilotkit/react-native/headless";
import { StatusBar } from "expo-status-bar";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState, Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import type { Section, Workspace } from "../../packages/domain/src";
import {
  AgentActivityScreen,
  AgentStatus,
  AppsScreen,
  GoalsScreen,
  IdeasScreen,
} from "./src/agent-ui";
import { AgentWorkspaceProvider, useAgentWorkspace } from "./src/agent-workspace";
import { API_URL, createSession, FuseApi, sessionHeaders } from "./src/api";
import { BrandLogo } from "./src/brand";
import { ChatScreen, WorkspaceTools } from "./src/chat";
import { ComputerEntry } from "./src/computer";
import { ComputerDraftProvider } from "./src/computer-drafts";
import { Details } from "./src/details";
import { MicOrbActivity } from "./src/mic-orb-activity";
import {
  DesktopSidebar,
  MobileBottomNavigation,
  MobileNavigationDrawer,
  MobileTopBar,
} from "./src/navigation";
import { BrowserScreen, CalendarScreen, FilesScreen, MailScreen } from "./src/screens";
import { ThreadsProvider, ThreadsSheet, useFuseThread } from "./src/threads";
import {
  Button,
  Card,
  colors,
  ErrorNotice,
  Field,
  Heading,
  LoadingNotice,
  Mascot,
  PageHeader,
  s,
} from "./src/ui";
import { type Detail, useWorkspace, WorkspaceContext } from "./src/workspace";

const titles: Partial<Record<Section, { title: string; subtitle: string }>> = {
  chat: { title: "Chat", subtitle: "Un espace dédié à vos échanges et aux contenus utiles." },
  activity: { title: "Activité", subtitle: "Plans, validations, avancement et résultats." },
  ideas: { title: "Idées", subtitle: "Des suggestions issues de vos services connectés." },
  goals: {
    title: "Portefeuille",
    subtitle: "Vos projets, jalons, priorités et tâches confiées à Alineo.",
  },
  apps: { title: "Applications", subtitle: "Connexions, préférences et mémoire enregistrée." },
  connections: {
    title: "Connexions",
    subtitle: "Services connectés et fonctionnalités disponibles.",
  },
  mail: { title: "Courrier", subtitle: "Messages et brouillons de votre espace." },
  calendar: {
    title: "Calendrier",
    subtitle: "Événements selon le calendrier et le fuseau choisis.",
  },
  browser: {
    title: "Navigateur",
    subtitle: "Vos sessions de navigation conservées au même endroit.",
  },
  files: {
    title: "Fichiers",
    subtitle: "PDF importés, remplis ou enregistrés depuis vos courriels.",
  },
};
const WEB_ACCESSIBILITY_STYLE_ID = "alineo-accessibility-preferences";

export default function App() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = "fr";
    if (document.getElementById(WEB_ACCESSIBILITY_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = WEB_ACCESSIBILITY_STYLE_ID;
    style.textContent = `
      html, body, #root { width: 100%; min-height: 100%; background: ${colors.canvas}; color-scheme: dark; }
      body { margin: 0; }
      html { text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
      #root [role="button"]:focus-visible,
      #root [role="tab"]:focus-visible,
      #root [role="link"]:focus-visible,
      #root input:focus-visible,
      #root textarea:focus-visible,
      #root select:focus-visible,
      #root a:focus-visible {
        outline: 3px solid ${colors.focus};
        outline-offset: 3px;
      }
      @media (prefers-reduced-motion: reduce) {
        #root *, #root *::before, #root *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
      @media (forced-colors: active) {
        #root [role="button"]:focus-visible,
        #root [role="tab"]:focus-visible,
        #root input:focus-visible,
        #root textarea:focus-visible,
        #root select:focus-visible {
          outline-color: Highlight;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);
  const [token, setToken] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const connect = useCallback(async (key?: string) => {
    setBusy(true);
    setError("");
    try {
      const session = await createSession(key);
      setToken(session.token);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }, []);
  useEffect(() => {
    void connect();
  }, [connect]);
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {token ? (
        <CopilotKitProvider
          runtimeUrl={`${API_URL}/api/copilotkit`}
          headers={sessionHeaders(token)}
        >
          <WorkspaceApp token={token} />
        </CopilotKitProvider>
      ) : (
        <SafeAreaView
          role="main"
          style={{
            flex: 1,
            backgroundColor: colors.canvas,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <View style={{ width: "100%", maxWidth: 420, gap: 22, alignItems: "center" }}>
            <BrandLogo size={72} showTagline centered />
            <Heading level={1} style={[s.title, { textAlign: "center" }]}>
              Ouvrez votre espace
            </Heading>
            <Text style={[s.muted, { textAlign: "center" }]}>
              Un espace plus serein pour votre quotidien.
            </Text>
            {busy ? (
              <LoadingNotice label="Connexion à votre espace…" centered />
            ) : (
              <Card style={{ width: "100%" }}>
                <ErrorNotice error={error} />
                <Field
                  label="Clé d’accès à l’espace"
                  value={accessKey}
                  onChangeText={setAccessKey}
                  secureTextEntry
                  placeholder="Requise uniquement pour certains espaces en ligne"
                />
                <Button primary onPress={() => void connect(accessKey || undefined)}>
                  Ouvrir l’espace
                </Button>
                <Text style={[s.small, { marginTop: 15 }]}>
                  Laissez ce champ vide pour un espace local. Un espace en ligne peut nécessiter une
                  clé.
                </Text>
              </Card>
            )}
          </View>
        </SafeAreaView>
      )}
    </SafeAreaProvider>
  );
}
function WorkspaceApp({ token }: { token: string }) {
  const api = useMemo(() => new FuseApi(token), [token]);
  const [workspace, setWorkspace] = useState<Workspace>();
  const [section, setSection] = useState<Section>("chat");
  const sectionRef = useRef<Section>("chat");
  const sectionHistory = useRef<Section[]>([]);
  const [detail, setDetail] = useState<Detail>();
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState<{ id: number; text: string }>();
  const refresh = useCallback(async () => {
    const snapshot = await api.request<Workspace>("/api/workspace");
    setWorkspace(snapshot);
    setError("");
  }, [api]);
  useEffect(() => {
    void refresh().catch((e) => setError(String(e)));
  }, [refresh]);
  useEffect(() => {
    const listener = AppState.addEventListener("change", (state) => {
      if (state === "active") void refresh().catch((e) => setError(String(e)));
    });
    return () => listener.remove();
  }, [refresh]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 5500);
    return () => clearTimeout(timer);
  }, [toast]);
  const navigate = useCallback((next: Section) => {
    const target = next === "today" ? "chat" : next === "connections" ? "apps" : next;
    if (sectionRef.current === target) return;
    sectionHistory.current = [...sectionHistory.current, sectionRef.current].slice(-30);
    sectionRef.current = target;
    setSection(target);
  }, []);
  const goBack = useCallback(() => {
    const target = sectionHistory.current.pop() || "apps";
    sectionRef.current = target;
    setSection(target);
  }, []);
  const backTitle = titles[sectionHistory.current.at(-1) || "apps"]?.title || "Chat";
  const open = useCallback((next: Detail) => setDetail(next), []);
  const close = useCallback(() => setDetail(undefined), []);
  const ask = useCallback(
    (text: string) => {
      setPrompt({ id: Date.now(), text });
      navigate("chat");
    },
    [navigate],
  );
  const retryWorkspace = useCallback(
    () => void refresh().catch((e) => setError(e instanceof Error ? e.message : String(e))),
    [refresh],
  );
  if (!workspace)
    return (
      <SafeAreaView
        role="main"
        style={{
          flex: 1,
          backgroundColor: colors.canvas,
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          gap: 18,
        }}
      >
        <Heading level={1} style={[s.title, { textAlign: "center" }]}>
          Votre espace
        </Heading>
        <Mascot size={56} state="thinking" />
        {error ? (
          <>
            <ErrorNotice error={error} />
            <Button onPress={() => void refresh().catch((e) => setError(String(e)))}>
              Réessayer
            </Button>
          </>
        ) : (
          <LoadingNotice label="Ouverture de votre espace…" centered />
        )}
      </SafeAreaView>
    );
  return (
    <WorkspaceContext.Provider
      value={{ workspace, api, section, navigate, refresh, open, close, notify: setToast, ask }}
    >
      <AgentWorkspaceProvider>
        <ComputerDraftProvider key={token}>
          <ThreadsProvider>
            <WorkspaceShell
              detail={detail}
              toast={toast}
              clearToast={() => setToast("")}
              error={error}
              prompt={prompt}
              backTitle={backTitle}
              goBack={goBack}
              retryWorkspace={retryWorkspace}
            />
          </ThreadsProvider>
        </ComputerDraftProvider>
      </AgentWorkspaceProvider>
    </WorkspaceContext.Provider>
  );
}
function WorkspaceBreadcrumb({
  workspaceName,
  sectionTitle,
}: {
  workspaceName: string;
  sectionTitle: string;
}) {
  return (
    <View
      role="banner"
      accessibilityLabel="Chemin de navigation"
      style={{
        height: 52,
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: colors.line,
      }}
    >
      <BrandLogo size={24} />
      <ChevronRight size={14} color={colors.muted} />
      <Text numberOfLines={1} style={[s.small, { maxWidth: "42%" }]}>
        {workspaceName}
      </Text>
      <ChevronRight size={14} color={colors.muted} />
      <Text numberOfLines={1} style={[s.small, { color: colors.text, fontWeight: "600" }]}>
        {sectionTitle}
      </Text>
    </View>
  );
}

function WorkspaceShell({
  detail,
  toast,
  clearToast,
  error,
  prompt,
  backTitle,
  goBack,
  retryWorkspace,
}: {
  detail?: Detail;
  toast: string;
  clearToast: () => void;
  error: string;
  prompt?: { id: number; text: string };
  backTitle: string;
  goBack: () => void;
  retryWorkspace: () => void;
}) {
  const { workspace, section, navigate, open } = useWorkspace();
  const { data, error: agentError, refresh: refreshAgent } = useAgentWorkspace();
  const {
    selection,
    visited,
    localThreads,
    mainId,
    loading: threadsLoading,
    error: threadsError,
    retry: retryThreads,
    enabled: richThreads,
  } = useFuseThread();
  const [threadsOpen, setThreadsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [navigationReturnFocusId, setNavigationReturnFocusId] = useState(
    "alineo-mobile-menu-trigger",
  );
  const [chatReplying, setChatReplying] = useState(false);
  const [toastDismissFocused, setToastDismissFocused] = useState(false);
  const { width } = useWindowDimensions();
  const desktop = width >= 900;
  const pending =
    (data?.notifications.filter((notification) => !notification.read).length || 0) +
    workspace.actions.filter((action) => action.status === "awaiting_review").length;
  const activeTask =
    data?.tasks.find(
      (task) => task.status === "waiting_approval" || task.status === "waiting_input",
    ) || data?.tasks.find((task) => task.status === "running");
  const agentName = data?.identity.name || "Alineo";
  const status = activeTask
    ? activeTask.status === "waiting_approval"
      ? `À valider · ${activeTask.title}`
      : activeTask.status === "waiting_input"
        ? `Informations requises · ${activeTask.title}`
        : activeTask.plan.find((step) => step.status === "running")?.title || activeTask.title
    : data?.tasks.some((task) => task.status === "queued")
      ? "Lancement de votre prochaine tâche…"
      : "À votre écoute";
  const title = titles[section] || titles.apps;
  const Screen =
    section === "mail"
      ? MailScreen
      : section === "calendar"
        ? CalendarScreen
        : section === "browser"
          ? BrowserScreen
          : section === "files"
            ? FilesScreen
            : section === "activity"
              ? AgentActivityScreen
              : section === "ideas"
                ? IdeasScreen
                : section === "goals"
                  ? GoalsScreen
                  : AppsScreen;
  const utility = ["mail", "calendar", "browser", "files"].includes(section);
  const workspaceName =
    workspace.mode === "sample" ? "Espace de démonstration" : workspace.profile.name;
  const avatar = data?.identity.avatar;
  const appearance = data?.identity.micOrb;
  const reportChatReplying = useCallback((replying: boolean) => setChatReplying(replying), []);

  useEffect(() => {
    if (desktop) setNavigationOpen(false);
  }, [desktop]);

  function openNavigation(
    returnFocusId: "alineo-mobile-menu-trigger" | "alineo-mobile-more-trigger",
  ) {
    setNavigationReturnFocusId(returnFocusId);
    setNavigationOpen(true);
  }
  function selectSection(next: Section) {
    setNavigationOpen(false);
    navigate(next);
  }
  function openConversations() {
    setNavigationOpen(false);
    setThreadsOpen(true);
  }
  function openNotifications() {
    setNavigationOpen(false);
    open({ type: "notifications" });
  }
  function openComputer() {
    setNavigationOpen(false);
    open({ type: "computer" });
  }

  return (
    <>
      <WorkspaceTools />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.canvas }}
        edges={["top", "bottom", "left", "right"]}
      >
        <View
          style={{
            flex: 1,
            minWidth: 0,
            flexDirection: desktop ? "row" : "column",
            backgroundColor: colors.canvas,
          }}
        >
          {desktop ? (
            <DesktopSidebar
              section={section}
              agentName={agentName}
              status={status}
              avatar={avatar}
              appearance={appearance}
              workspaceName={workspaceName}
              pending={pending}
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
              navigate={navigate}
              onOpenThreads={openConversations}
              onOpenNotifications={openNotifications}
              onOpenComputer={openComputer}
            />
          ) : (
            <>
              <MobileTopBar
                agentName={agentName}
                status={status}
                avatar={avatar}
                appearance={appearance}
                pending={pending}
                onOpenMenu={() => openNavigation("alineo-mobile-menu-trigger")}
                onOpenNotifications={openNotifications}
              />
              {section === "chat" && (
                <View
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 7,
                    backgroundColor: colors.card,
                  }}
                >
                  <ComputerEntry />
                </View>
              )}
            </>
          )}

          <View
            style={{
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              padding: desktop ? 8 : 0,
              backgroundColor: colors.canvas,
            }}
          >
            <View
              style={{
                flex: 1,
                minWidth: 0,
                minHeight: 0,
                overflow: "hidden",
                borderRadius: desktop ? 16 : 0,
                borderWidth: desktop ? 1 : 0,
                borderColor: colors.line,
                backgroundColor: colors.canvas,
              }}
            >
              {desktop && (
                <WorkspaceBreadcrumb
                  workspaceName={workspaceName}
                  sectionTitle={title?.title || "Applications"}
                />
              )}
              <View
                role="main"
                accessibilityLabel={`Écran ${title?.title || "Applications"}`}
                aria-hidden={!!detail}
                accessibilityElementsHidden={!!detail}
                importantForAccessibility={detail ? "no-hide-descendants" : "auto"}
                style={{ flex: 1, minHeight: 0 }}
              >
                {section !== "chat" ? (
                  <ScrollView
                    key={section}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flexGrow: 1 }}
                  >
                    <View
                      style={{
                        width: "100%",
                        maxWidth: desktop ? 1240 : 780,
                        alignSelf: "center",
                        paddingHorizontal: desktop ? 42 : 20,
                        paddingTop: desktop ? 34 : 24,
                        paddingBottom: 36,
                      }}
                    >
                      {utility && !desktop && (
                        <Button
                          small
                          icon={ChevronLeft}
                          style={{ alignSelf: "flex-start", marginBottom: 12 }}
                          onPress={goBack}
                        >
                          Retour à {backTitle}
                        </Button>
                      )}
                      <PageHeader
                        title={title?.title || "Applications"}
                        subtitle={title?.subtitle}
                      />
                      {!!error && (
                        <>
                          <ErrorNotice error={error} />
                          <Button
                            small
                            onPress={retryWorkspace}
                            style={{ alignSelf: "flex-start", marginBottom: 18 }}
                          >
                            Réessayer l’actualisation de l’espace
                          </Button>
                        </>
                      )}
                      <Screen />
                    </View>
                  </ScrollView>
                ) : (
                  <View style={{ flex: 1, minHeight: 0 }}>
                    <View
                      style={{
                        width: "100%",
                        maxWidth: desktop ? 1160 : 860,
                        flex: 1,
                        alignSelf: "center",
                        paddingHorizontal: desktop ? 40 : 18,
                        paddingTop: desktop ? 30 : 22,
                        paddingBottom: 12,
                      }}
                    >
                      <PageHeader title={title?.title || "Chat"} subtitle={title?.subtitle} />
                      {!!error && (
                        <>
                          <ErrorNotice error={error} />
                          <Button
                            small
                            onPress={retryWorkspace}
                            style={{ alignSelf: "flex-start", marginBottom: 12 }}
                          >
                            Réessayer l’actualisation de l’espace
                          </Button>
                        </>
                      )}
                      <AgentStatus />
                      <View style={{ flex: 1, minHeight: 0, paddingTop: 8 }}>
                        <ErrorNotice
                          error={
                            threadsError && richThreads
                              ? threadsError
                              : threadsError
                                ? `Impossible de charger vos conversations. ${threadsError}`
                                : ""
                          }
                        />
                        {threadsError && (
                          <Button onPress={retryThreads} style={{ alignSelf: "center" }}>
                            Réessayer le chargement des conversations
                          </Button>
                        )}
                        {threadsLoading && (
                          <LoadingNotice label="Chargement de vos conversations…" />
                        )}
                        {!threadsLoading && selection.id !== mainId && (
                          <Text style={[s.small, { textAlign: "center", marginBottom: 8 }]}>
                            {richThreads
                              ? "Conversation secondaire"
                              : localThreads.find((item) => item.id === selection.id)?.title ||
                                "Nouvelle conversation"}
                          </Text>
                        )}
                        <View style={{ flex: 1, minHeight: 0 }}>
                          {(!richThreads || (!threadsLoading && !threadsError)) &&
                            visited.map((thread) => (
                              <View
                                key={thread.id}
                                style={{
                                  display: selection.id === thread.id ? "flex" : "none",
                                  flex: 1,
                                  minHeight: 0,
                                }}
                              >
                                <ChatScreen
                                  thread={thread}
                                  active={section === "chat" && selection.id === thread.id}
                                  prompt={selection.id === thread.id ? prompt : undefined}
                                  onReplyingChange={reportChatReplying}
                                />
                              </View>
                            ))}
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>

          {!desktop && (
            <MobileBottomNavigation
              section={section}
              navigate={navigate}
              onOpenMenu={() => openNavigation("alineo-mobile-more-trigger")}
            />
          )}
        </View>
        <MicOrbActivity
          desktop={desktop}
          section={section}
          toastVisible={!!toast}
          chatReplying={chatReplying}
          data={data}
          error={agentError}
          refresh={refreshAgent}
        />
        {!!toast && (
          <View
            role="status"
            accessibilityLiveRegion="polite"
            pointerEvents="box-none"
            style={{
              position: "absolute",
              bottom: desktop ? 24 : 92,
              left: desktop ? 252 : 12,
              right: 12,
              alignItems: "center",
            }}
          >
            <View
              style={[
                s.row,
                {
                  gap: 10,
                  padding: 10,
                  paddingLeft: 14,
                  backgroundColor: colors.raised,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: colors.line,
                  maxWidth: 560,
                },
              ]}
            >
              <Check size={16} color={colors.accentDark} />
              <Text style={{ color: colors.text, fontSize: 13, flexShrink: 1 }}>{toast}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Fermer la notification"
                accessibilityHint="Masquer ce message de confirmation."
                onFocus={() => setToastDismissFocused(true)}
                onBlur={() => setToastDismissFocused(false)}
                onPress={clearToast}
                style={{
                  width: 44,
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 22,
                  borderWidth: 2,
                  borderColor: toastDismissFocused ? colors.focus : "transparent",
                }}
              >
                <X size={16} color="#FFF" />
              </Pressable>
            </View>
          </View>
        )}
        {!desktop && navigationOpen && (
          <MobileNavigationDrawer
            visible={navigationOpen}
            section={section}
            agentName={agentName}
            status={status}
            avatar={avatar}
            appearance={appearance}
            workspaceName={workspaceName}
            pending={pending}
            returnFocusId={navigationReturnFocusId}
            navigate={selectSection}
            onClose={() => setNavigationOpen(false)}
            onOpenThreads={openConversations}
            onOpenNotifications={openNotifications}
            onOpenComputer={openComputer}
          />
        )}
        {threadsOpen && <ThreadsSheet onClose={() => setThreadsOpen(false)} />}
        {detail && (
          <Details
            key={
              detail.type === "task"
                ? detail.taskId
                : detail.type === "file"
                  ? detail.file.id
                  : detail.type === "browser"
                    ? detail.browser.id
                    : detail.type === "mail"
                      ? detail.mail.id
                      : detail.type === "review"
                        ? detail.action.id
                        : detail.type === "email"
                          ? JSON.stringify(detail.draft)
                          : detail.type === "event"
                            ? detail.event?.id || "event-new"
                            : detail.type
            }
            detail={detail}
          />
        )}
      </SafeAreaView>
    </>
  );
}
