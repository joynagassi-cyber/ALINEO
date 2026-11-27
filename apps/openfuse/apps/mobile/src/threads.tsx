import { useThreads } from "@copilotkit/react-native/headless";
import {
  Archive,
  CalendarDays,
  FileText,
  MessageCircle,
  Monitor,
  Plus,
  RefreshCw,
  Settings2,
} from "lucide-react-native";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { relativeDate } from "./relative-date";
import { Button, colors, ErrorNotice, Field, LinkRow, Sheet, s } from "./ui";
import { useWorkspace } from "./workspace";

function newThreadId() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
export type Selection = { id: string; existing: boolean };
export interface LocalConversationSummary {
  id: string;
  title: string;
  updatedAt: string;
}
const ThreadContext = createContext<{
  enabled: boolean;
  selection: Selection;
  visited: Selection[];
  localThreads: LocalConversationSummary[];
  mainId: string;
  loading: boolean;
  starting: boolean;
  error: string;
  retry: () => void;
  refreshLocalThreads: () => Promise<void>;
  select: (selection: Selection) => void;
  start: () => Promise<boolean>;
  claimPrompt: (id: number) => boolean;
} | null>(null);
export function ThreadsProvider({ children }: { children: ReactNode }) {
  const { workspace, navigate, api } = useWorkspace();
  const handledPrompt = useRef(0);
  const enabled = workspace.runtime.richThreads === true;
  const [selection, setSelection] = useState<Selection>({ id: "local", existing: true });
  const [visited, setVisited] = useState<Selection[]>([{ id: "local", existing: true }]);
  const [localThreads, setLocalThreads] = useState<LocalConversationSummary[]>([]);
  const [mainId, setMainId] = useState("local");
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const startingRef = useRef(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const refreshLocalThreads = useCallback(async () => {
    if (enabled) return;
    try {
      const response = await api.request<{ threads: LocalConversationSummary[] }>(
        "/api/conversations",
      );
      setLocalThreads(response.threads);
      const saved = new Set(response.threads.map((item) => item.id));
      setVisited((items) => {
        const persisted = [
          { id: "local", existing: true },
          ...response.threads.map((item) => ({ id: item.id, existing: true })),
        ];
        return [
          ...persisted,
          ...items.filter((item) => item.id !== "local" && !saved.has(item.id)),
        ];
      });
      setError("");
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
      throw e;
    }
  }, [api, enabled]);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    if (enabled) {
      void api
        .request<{ threadId: string; existing: boolean }>("/api/main-thread")
        .then((main) => {
          if (!active) return;
          const next = { id: main.threadId, existing: main.existing };
          setMainId(next.id);
          setSelection(next);
          setVisited([next]);
          setLoading(false);
        })
        .catch((e) => {
          if (active) {
            setLoading(false);
            setError(e instanceof Error ? e.message : String(e));
          }
        });
    } else {
      void api
        .request<{ threads: LocalConversationSummary[] }>("/api/conversations")
        .then(({ threads: saved }) => {
          if (!active) return;
          setMainId("local");
          setLocalThreads(saved);
          setVisited([
            { id: "local", existing: true },
            ...saved.map((item) => ({ id: item.id, existing: true })),
          ]);
          setLoading(false);
        })
        .catch((e) => {
          if (active) {
            setLoading(false);
            setError(e instanceof Error ? e.message : String(e));
          }
        });
    }
    return () => {
      active = false;
    };
  }, [api, enabled, attempt]);
  function select(next: Selection) {
    setSelection(next);
    setVisited((items) => (items.some((item) => item.id === next.id) ? items : [...items, next]));
    navigate("chat");
  }
  async function start(): Promise<boolean> {
    if (startingRef.current) return false;
    const next = { id: newThreadId(), existing: false };
    setError("");
    if (enabled) {
      startingRef.current = true;
      setStarting(true);
      try {
        const created = await api.request<{ threadId: string }>(
          "/api/threads",
          { threadId: next.id },
          "POST",
        );
        const selection = { id: created.threadId, existing: true };
        setSelection(selection);
        setVisited((items) => [...items, selection]);
        navigate("chat");
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        return false;
      } finally {
        startingRef.current = false;
        setStarting(false);
      }
    }
    setSelection(next);
    setVisited((items) => [...items, next]);
    const updatedAt = new Date().toISOString();
    setLocalThreads((items) => [
      { id: next.id, title: "Nouvelle conversation", updatedAt },
      ...items.filter((item) => item.id !== next.id),
    ]);
    void api
      .request(`/api/conversations/${next.id}`, { messages: [] }, "PUT")
      .then(() => refreshLocalThreads())
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
    navigate("chat");
    return true;
  }
  return (
    <ThreadContext.Provider
      value={{
        claimPrompt: (id) => {
          if (handledPrompt.current === id) return false;
          handledPrompt.current = id;
          return true;
        },
        enabled,
        mainId,
        visited,
        localThreads,
        loading,
        starting,
        error,
        retry: () => setAttempt((n) => n + 1),
        refreshLocalThreads,
        selection,
        select,
        start,
      }}
    >
      {children}
    </ThreadContext.Provider>
  );
}
export function useFuseThread() {
  const context = useContext(ThreadContext);
  if (!context) throw new Error("Le service des conversations est indisponible.");
  return context;
}
export function ThreadsSheet({ onClose }: { onClose: () => void }) {
  const {
    enabled,
    selection,
    visited,
    localThreads,
    mainId,
    loading,
    starting,
    error: mainError,
    retry,
    select,
    start,
  } = useFuseThread();
  const { workspace, open, navigate, refresh } = useWorkspace();
  const threads = useThreads({ agentId: "default", enabled, includeArchived: true, limit: 20 });
  const [editing, setEditing] = useState<string>();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [archived, setArchived] = useState(false);
  async function mutate(action: () => Promise<void>) {
    setError("");
    try {
      await action();
      setEditing(undefined);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }
  function go(section: "calendar" | "files" | "apps") {
    onClose();
    navigate(section);
  }
  return (
    <Sheet
      title="Alineo"
      subtitle={workspace.mode === "sample" ? "Votre espace" : workspace.profile.name}
      onClose={onClose}
    >
      <View style={{ gap: 14 }}>
        {enabled && loading ? (
          <>
            <ErrorNotice error={mainError} />
            {mainError ? (
              <Button onPress={retry}>Réessayer le chat principal</Button>
            ) : (
              <ActivityIndicator color={colors.accentDark} />
            )}
          </>
        ) : enabled ? (
          <>
            <LinkRow
              icon={MessageCircle}
              title="Chat principal"
              detail="Votre conversation principale"
              onPress={() => {
                select({ id: mainId, existing: true });
                onClose();
              }}
            />
            <Button
              primary
              icon={Plus}
              busy={starting}
              onPress={() =>
                void start().then((started) => {
                  if (started) onClose();
                })
              }
            >
              Nouvelle conversation secondaire
            </Button>
            <View style={[s.between, { marginTop: 12 }]}>
              <Text style={s.heading}>Conversations secondaires</Text>
              <Button small onPress={() => setArchived(!archived)}>
                {archived ? "Afficher les conversations actives" : "Archives"}
              </Button>
            </View>
            {threads.isLoading && <ActivityIndicator color={colors.accentDark} />}
            <ErrorNotice error={error || mainError || threads.error?.message} />
            {threads.error && (
              <Button small onPress={threads.refetchThreads}>
                Réessayer le chargement des conversations
              </Button>
            )}
            {!archived &&
              visited
                .filter(
                  (item) =>
                    item.id !== mainId && !threads.threads.some((saved) => saved.id === item.id),
                )
                .map((item, index) => (
                  <LinkRow
                    key={item.id}
                    icon={MessageCircle}
                    title={`Conversation secondaire ${index + 1}`}
                    detail="Ouvrir dans cette application"
                    onPress={() => {
                      select(item);
                      onClose();
                    }}
                  />
                ))}
            {threads.threads
              .filter((thread) => thread.id !== mainId && thread.archived === archived)
              .map((thread) => (
                <View
                  key={thread.id}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.line,
                    gap: 10,
                  }}
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Ouvrir la conversation : ${thread.name || "Conversation sans titre"}`}
                    accessibilityState={{ selected: selection.id === thread.id }}
                    onPress={() => {
                      select({ id: thread.id, existing: true });
                      onClose();
                    }}
                    style={[s.row, { gap: 10 }]}
                  >
                    <MessageCircle size={19} color={colors.text} />
                    <Text style={[s.text, { flex: 1 }]}>
                      {thread.name || "Conversation sans titre"}
                    </Text>
                  </Pressable>
                  {editing === thread.id && (
                    <Field label="Nom de la conversation" value={name} onChangeText={setName} />
                  )}
                  <View style={[s.row, { gap: 8 }]}>
                    <Button
                      small
                      disabled={threads.isMutating || (editing === thread.id && !name.trim())}
                      onPress={() => {
                        if (editing === thread.id)
                          void mutate(() => threads.renameThread(thread.id, name.trim()));
                        else {
                          setEditing(thread.id);
                          setName(thread.name || "");
                        }
                      }}
                    >
                      {editing === thread.id ? "Enregistrer le nom" : "Renommer"}
                    </Button>
                    <Button
                      small
                      icon={Archive}
                      disabled={threads.isMutating}
                      onPress={() =>
                        void mutate(() =>
                          thread.archived
                            ? threads.unarchiveThread(thread.id)
                            : threads.archiveThread(thread.id),
                        )
                      }
                    >
                      {thread.archived ? "Restaurer" : "Archiver"}
                    </Button>
                  </View>
                </View>
              ))}
            {!threads.isLoading &&
              !threads.error &&
              !threads.threads.some(
                (thread) => thread.id !== mainId && thread.archived === archived,
              ) && (
                <Text style={s.muted}>
                  {archived
                    ? "Aucune conversation archivée."
                    : "Gardez ici un sujet à part. Votre conversation principale reste toujours disponible."}
                </Text>
              )}
            <ErrorNotice error={threads.fetchMoreError?.message} />
            {threads.hasMoreThreads && (
              <Button small busy={threads.isFetchingMoreThreads} onPress={threads.fetchMoreThreads}>
                Afficher plus de conversations
              </Button>
            )}
            <Text style={s.small}>
              Les conversations secondaires gardent leur propre historique. La mémoire enregistrée
              de votre assistant est partagée.
            </Text>
          </>
        ) : (
          <>
            <ErrorNotice error={mainError} />
            {!!mainError && (
              <Button small onPress={retry}>
                Réessayer le chargement
              </Button>
            )}
            <LinkRow
              icon={MessageCircle}
              title="Chat principal"
              detail="Votre conversation principale"
              onPress={() => {
                select({ id: mainId, existing: true });
                onClose();
              }}
            />
            <Button
              primary
              icon={Plus}
              onPress={() =>
                void start().then((started) => {
                  if (started) onClose();
                })
              }
            >
              Nouvelle conversation
            </Button>
            <View style={[s.between, { marginTop: 12 }]}>
              <Text style={s.heading}>Vos conversations</Text>
              {loading && <ActivityIndicator color={colors.accentDark} />}
            </View>
            {localThreads.map((thread) => (
              <LinkRow
                key={thread.id}
                icon={MessageCircle}
                title={thread.title || "Conversation sans titre"}
                detail={
                  thread.updatedAt
                    ? `Modifiée ${relativeDate(thread.updatedAt)}`
                    : "Historique enregistré"
                }
                onPress={() => {
                  select({ id: thread.id, existing: true });
                  onClose();
                }}
              />
            ))}
            {!loading && !mainError && localThreads.length === 0 && (
              <Text style={s.muted}>
                Aucune conversation secondaire. Créez-en une pour garder un sujet à part.
              </Text>
            )}
            <Text style={s.small}>
              Chaque conversation garde son propre historique. Les conversations restent disponibles
              après avoir fermé l’application.
            </Text>
          </>
        )}
        <View style={s.divider} />
        <LinkRow
          icon={Plus}
          title="Confier une tâche"
          detail="Un plan, un document ou un récapitulatif des dépenses"
          onPress={() => {
            onClose();
            open({ type: "delegate" });
          }}
        />
        <LinkRow
          icon={Monitor}
          title="Ordinateur de l’assistant"
          detail="Navigateur, sessions et documents"
          onPress={() => {
            onClose();
            open({ type: "computer" });
          }}
        />
        <LinkRow icon={CalendarDays} title="Calendrier" onPress={() => go("calendar")} />
        <LinkRow icon={FileText} title="Fichiers" onPress={() => go("files")} />
        <LinkRow icon={Settings2} title="Applications et préférences" onPress={() => go("apps")} />
        <Button small icon={RefreshCw} onPress={() => void mutate(refresh)}>
          Actualiser l’espace
        </Button>
      </View>
    </Sheet>
  );
}
