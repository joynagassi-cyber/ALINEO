import {
  ArrowLeft,
  FilePlus2,
  FileText,
  Folder,
  FolderPlus,
  Monitor,
  Play,
  Power,
  RefreshCw,
  Save,
  Terminal,
  Upload,
} from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, AppState, Platform, Text, View } from "react-native";
import type { Artifact } from "../../../packages/domain/src";
import type {
  ComputerCommand,
  ComputerDirectory,
  ComputerSnapshot,
} from "../../../packages/domain/src/computer";
import { useComputerDraft } from "./computer-drafts";
import { DesktopStream } from "./desktop-stream";
import { frenchStatusLabel } from "./locale";
import { Button, Card, colors, Empty, ErrorNotice, Field, LinkRow, s, timeLabel } from "./ui";
import { useWorkspace } from "./workspace";

const mono = Platform.OS === "ios" ? "Menlo" : "monospace";
const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

export function LinuxWorkspace({
  tab,
  onSnapshot,
}: {
  tab: "Terminal" | "Files" | "Desktop";
  onSnapshot?: (snapshot: ComputerSnapshot) => void;
}) {
  const { api } = useWorkspace();
  const [snapshot, setSnapshot] = useState<ComputerSnapshot>();
  const [error, setError] = useState("");
  const [connectionError, setConnectionError] = useState("");
  const [busy, setBusy] = useState(false);
  const [command, setCommand] = useComputerDraft("command");
  const [cwd, setCwd] = useComputerDraft("cwd");
  const [executing, setExecuting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [editingCommand, setEditingCommand] = useState(false);
  const version = useRef(0);
  const polling = useRef(false);
  const mutations = useRef(0);
  const refresh = useCallback(async () => {
    if (polling.current || mutations.current) return;
    polling.current = true;
    const request = ++version.current;
    try {
      const next = await api.request<ComputerSnapshot>("/api/computer");
      if (request === version.current) {
        setSnapshot(next);
        setConnectionError("");
      }
    } catch (e) {
      if (request === version.current) setConnectionError(message(e));
    } finally {
      polling.current = false;
    }
  }, [api]);
  useEffect(() => {
    const poll = () => {
      if (AppState.currentState !== "active") return;
      void refresh();
    };
    void refresh();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") poll();
    });
    const watching = tab === "Desktop" && Platform.OS === "web" && snapshot?.status === "running";
    const active =
      executing || busy || snapshot?.commands.some((item) => item.status === "running");
    const interval = watching || active ? setInterval(poll, 5000) : undefined;
    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [
    refresh,
    tab,
    executing,
    busy,
    snapshot?.status,
    snapshot?.commands.some((item) => item.status === "running"),
  ]);

  useEffect(
    () => () => {
      version.current++;
    },
    [refresh],
  );

  async function control(action: "start" | "stop") {
    if (busy) return;
    setBusy(true);
    setError("");
    mutations.current++;
    const operation = ++version.current;
    try {
      const next = await api.request<ComputerSnapshot>(`/api/computer/${action}`, {});
      if (operation === version.current) setSnapshot(next);
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
      mutations.current--;
      void refresh();
    }
  }
  async function run() {
    if (!command.trim() || executing || busy) return;
    const sent = command;
    setExecuting(true);
    setError("");
    mutations.current++;
    const operation = ++version.current;
    try {
      const result = await api.request<ComputerCommand>("/api/computer/commands", {
        command: sent,
        cwd,
      });
      if (operation === version.current)
        setSnapshot((current) =>
          current
            ? {
                ...current,
                commands: [result, ...current.commands.filter((item) => item.id !== result.id)],
              }
            : current,
        );
      setCommand((current) => (current === sent ? "" : current));
      setEditingCommand(false);
    } catch (e) {
      setError(message(e));
    } finally {
      setExecuting(false);
      mutations.current--;
      void refresh();
    }
  }
  useEffect(() => {
    if (snapshot) onSnapshot?.(snapshot);
  }, [snapshot, onSnapshot]);
  const running = snapshot?.status === "running";
  const commandRunning = executing || snapshot?.commands.some((item) => item.status === "running");
  return (
    <View style={{ gap: 16 }}>
      <Card style={{ backgroundColor: colors.sky, gap: 12 }}>
        <View style={[s.row, { gap: 12 }]}>
          <Terminal size={24} color={colors.accentDark} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={s.heading}>Votre espace Linux</Text>
            <Text style={s.muted}>
              {running
                ? "En cours · vos fichiers sont conservés après l’arrêt"
                : snapshot?.status === "stopped"
                  ? "À l’arrêt · vos fichiers sont enregistrés"
                  : snapshot?.status === "unconfigured"
                    ? "Configurez l’ordinateur pour commencer"
                    : snapshot?.status === "error"
                      ? "La connexion nécessite votre attention"
                      : "Connexion en cours…"}
            </Text>
          </View>
          {!snapshot && !error && <ActivityIndicator color={colors.accentDark} />}
        </View>
        {!!snapshot?.message && <Text style={s.small}>{snapshot.message}</Text>}
        {snapshot?.enabled && (
          <View style={[s.row, { gap: 8, flexWrap: "wrap" }]}>
            {running ? (
              <Button icon={Power} busy={busy} onPress={() => void control("stop")}>
                Arrêter l’ordinateur
              </Button>
            ) : (
              <Button primary icon={Play} busy={busy} onPress={() => void control("start")}>
                Démarrer l’ordinateur
              </Button>
            )}
            <Button
              icon={RefreshCw}
              disabled={busy}
              onPress={() =>
                void refresh()
                  .then(() => setError(""))
                  .catch((e) => setError(message(e)))
              }
            >
              Actualiser
            </Button>
          </View>
        )}
      </Card>
      <ErrorNotice error={error || connectionError} />
      {!snapshot && (error || connectionError) && (
        <Button
          onPress={() =>
            void refresh()
              .then(() => setError(""))
              .catch((e) => setError(message(e)))
          }
        >
          Réessayer la connexion
        </Button>
      )}
      {snapshot?.enabled && (
        <>
          <View style={{ display: tab === "Terminal" ? "flex" : "none", gap: 16 }}>
            {editingCommand || command.length > 0 || snapshot.commands.length === 0 ? (
              <View
                style={{ borderRadius: 22, backgroundColor: colors.disabled, padding: 18, gap: 8 }}
              >
                <Text style={{ color: colors.muted, fontSize: 12, fontFamily: mono }}>
                  TERMINAL
                </Text>
                <Field
                  label="Dossier de travail"
                  value={cwd}
                  onChangeText={setCwd}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ fontFamily: mono }}
                />
                <Field
                  label="Commande"
                  value={command}
                  onChangeText={setCommand}
                  placeholder="pwd"
                  multiline
                  maxLength={16000}
                  autoCapitalize="none"
                  autoCorrect={false}
                  spellCheck={false}
                  smartInsertDelete={false}
                  keyboardType="ascii-capable"
                  style={{ fontFamily: mono, minHeight: 80 }}
                />
                {/[‘’“”]/.test(command) && (
                  <Button
                    small
                    onPress={() =>
                      setCommand((text) => text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"'))
                    }
                  >
                    Utiliser des guillemets droits
                  </Button>
                )}
                <Button
                  primary
                  icon={Play}
                  busy={!!commandRunning}
                  disabled={!running || !command.trim() || busy}
                  onPress={() => void run()}
                >
                  Exécuter la commande
                </Button>
                <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 18 }}>
                  {snapshot.network === "enabled"
                    ? "S’exécute sur votre ordinateur avec accès à Internet. Lancez les applications graphiques avec >/dev/null 2>&1 & pour les ouvrir dans l’onglet Bureau."
                    : "S’exécute sur votre ordinateur sans accès au réseau. Utilisez le navigateur pour accéder au Web."}
                </Text>
              </View>
            ) : (
              <Button
                primary
                icon={Terminal}
                disabled={!running || busy || !!commandRunning}
                onPress={() => setEditingCommand(true)}
              >
                Nouvelle commande
              </Button>
            )}
            {!!commandRunning && (
              <Text style={s.muted}>
                Exécution en cours… Le résultat apparaîtra ici. Arrêtez l’ordinateur pour
                interrompre les commandes actives.
              </Text>
            )}
            {snapshot.commands.length === 0 ? (
              <Empty
                icon={Terminal}
                title="Prêt pour votre première commande"
                detail="Exécutez des scripts, gérez vos fichiers ou demandez à votre assistant de créer quelque chose ici."
              />
            ) : (
              [...snapshot.commands]
                .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
                .slice(0, showHistory ? undefined : 5)
                .map((run) => <CommandReceipt key={run.id} run={run} />)
            )}
            {snapshot.commands.length > 5 && (
              <Button small onPress={() => setShowHistory(!showHistory)}>
                {showHistory ? "Afficher les commandes récentes" : "Commandes précédentes"}
              </Button>
            )}
          </View>
          <View style={{ display: tab === "Files" ? "flex" : "none" }}>
            <ComputerFiles running={!!running} active={tab === "Files"} />
          </View>
          {snapshot.provider === "e2b-desktop" && tab === "Desktop" && (
            <ComputerDesktop running={!!running} />
          )}
        </>
      )}
    </View>
  );
}

// Live view of the computer's desktop, shared with the chat's desktop card.
function ComputerDesktop({ running }: { running: boolean }) {
  if (!running)
    return (
      <Empty
        icon={Monitor}
        title="Le bureau est éteint"
        detail="Démarrez l’ordinateur pour afficher et contrôler son bureau."
      />
    );
  return (
    <View style={{ gap: 12 }}>
      <DesktopStream running />
      <Text style={s.small}>
        Vous et votre assistant partagez ce bureau. L’arrêt de l’ordinateur ferme les applications ;
        les fichiers de /workspace sont conservés. L’ouverture du bureau maintient l’ordinateur
        actif pendant 30 minutes : gardez cet onglet ouvert ou revenez dans l’application pour
        prolonger la session. Ce lien permet de contrôler le bureau : ne le partagez pas.
      </Text>
    </View>
  );
}

function CommandReceipt({ run }: { run: ComputerCommand }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <Card style={{ gap: 10 }}>
      <View style={[s.between, { gap: 10 }]}>
        <Text
          style={[
            s.small,
            {
              color:
                run.status === "succeeded"
                  ? colors.accentDark
                  : run.status === "running"
                    ? colors.focus
                    : colors.danger,
            },
          ]}
        >
          {frenchStatusLabel(run.status)}
          {run.exitCode !== undefined ? ` · code de sortie ${run.exitCode}` : ""}
        </Text>
        <Text style={s.small}>{timeLabel(run.startedAt)}</Text>
      </View>
      <Text
        selectable
        style={[s.text, { fontFamily: mono, fontSize: 13 }]}
      >{`$ ${run.command}`}</Text>
      <Text style={[s.small, { fontFamily: mono }]}>{run.cwd}</Text>
      {expanded && (
        <>
          {!!run.stdout && (
            <Text selectable style={[s.text, { fontFamily: mono, fontSize: 12, lineHeight: 19 }]}>
              {run.stdout}
            </Text>
          )}
          {!!run.stderr && (
            <Text
              selectable
              style={[
                s.text,
                { fontFamily: mono, fontSize: 12, lineHeight: 19, color: colors.danger },
              ]}
            >
              {run.stderr}
            </Text>
          )}
          {!run.stdout && !run.stderr && run.status !== "running" && (
            <Text style={s.small}>Aucune sortie</Text>
          )}
          {run.truncated && (
            <Text style={s.small}>
              La limite d’affichage est atteinte. Enregistrez les résultats volumineux dans un
              fichier.
            </Text>
          )}
        </>
      )}
      {!!(run.stdout || run.stderr) && (
        <Button small onPress={() => setExpanded(!expanded)}>
          {expanded ? "Masquer la sortie" : "Afficher la sortie"}
        </Button>
      )}
    </Card>
  );
}

function ComputerFiles({ running, active }: { running: boolean; active: boolean }) {
  const { api, workspace, open, refresh } = useWorkspace();
  const [path, setPath] = useComputerDraft("path");
  const [directory, setDirectory] = useState<ComputerDirectory>();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const [retry, setRetry] = useState(0);
  const [editor, setEditor] = useComputerDraft("editor");
  const [folder, setFolder] = useState<string>();
  const [importing, setImporting] = useState(false);
  const dirty = !!editor && (editor.text !== editor.saved || editor.path !== editor.savedPath);
  useEffect(() => {
    if (!active || !running) {
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    setError("");
    void api
      .request<ComputerDirectory>(`/api/computer/files?path=${encodeURIComponent(path)}`)
      .then((value) => {
        if (alive) setDirectory(value);
      })
      .catch((e) => {
        if (alive) setError(message(e));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [api, active, running, path, retry]);

  async function read(file: string) {
    if (busy || loading || !running) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const content = await api.request<{ path: string; text: string }>(
        "/api/computer/files/read",
        { path: file },
      );
      if (mounted.current) setEditor({ ...content, saved: content.text, savedPath: content.path });
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  async function importDocument(file: Artifact) {
    if (busy || !running) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api.request("/api/computer/files/import", {
        fileId: file.id,
        path: `${path}/${file.name.replace(/[\\/]/g, "_")}`,
      });
      setImporting(false);
      setNotice("Document copié sur votre ordinateur.");
      setRetry((value) => value + 1);
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  async function openPdf(path: string) {
    if (busy || !running) return;
    setBusy(true);
    setError("");
    try {
      const file = await api.request<Artifact>("/api/computer/files/export", { path });
      await refresh();
      if (mounted.current) open({ type: "file", file });
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    if (!editor || busy) return;
    const sent = editor;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api.request("/api/computer/files/write", { path: sent.path, text: sent.text });
      if (mounted.current)
        setEditor((current) =>
          current?.path === sent.path
            ? { ...current, saved: sent.text, savedPath: sent.path }
            : current,
        );
      setNotice("Fichier enregistré sur votre ordinateur.");
      setRetry((value) => value + 1);
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  async function mkdir() {
    if (!folder?.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      await api.request("/api/computer/files/mkdir", { path: `${path}/${folder.trim()}` });
      setFolder(undefined);
      setRetry((value) => value + 1);
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <View style={{ gap: 12 }}>
      <View style={s.between}>
        <Text style={s.heading}>Fichiers de l’espace de travail</Text>
        {(busy || loading) && <ActivityIndicator color={colors.accentDark} />}
      </View>
      <Text selectable style={[s.small, { fontFamily: mono }]}>
        {editor?.path || path}
      </Text>
      <ErrorNotice error={error} />
      {!!notice && <Text style={[s.small, { color: colors.accentDark }]}>{notice}</Text>}
      {!running && (
        <Text style={s.muted}>
          Démarrez l’ordinateur pour parcourir ou modifier les fichiers enregistrés.
        </Text>
      )}
      {editor ? (
        <>
          <Field
            label="Chemin du fichier"
            value={editor.path}
            onChangeText={(value) => setEditor({ ...editor, path: value })}
            autoCorrect={false}
            autoCapitalize="none"
            style={{ fontFamily: mono }}
          />
          <Field
            label="Contenu du fichier"
            value={editor.text}
            onChangeText={(value) => setEditor({ ...editor, text: value })}
            multiline
            autoCorrect={false}
            spellCheck={false}
            smartInsertDelete={false}
            keyboardType="ascii-capable"
            autoCapitalize="none"
            style={{ fontFamily: mono, minHeight: 240, fontSize: 13 }}
          />
          <View style={[s.row, { flexWrap: "wrap", gap: 8 }]}>
            <Button
              primary
              icon={Save}
              busy={busy}
              disabled={!running || !editor.path.trim()}
              onPress={() => void save()}
            >
              Enregistrer le fichier
            </Button>
            <Button
              disabled={busy}
              icon={ArrowLeft}
              onPress={() => {
                setEditor(undefined);
                setNotice("");
              }}
            >
              {dirty ? "Abandonner les modifications" : "Retour aux fichiers"}
            </Button>
          </View>
        </>
      ) : (
        <>
          <View style={[s.row, { flexWrap: "wrap", gap: 8 }]}>
            {path !== "/workspace" && (
              <Button
                small
                disabled={busy}
                icon={ArrowLeft}
                onPress={() => setPath(path.slice(0, path.lastIndexOf("/")) || "/workspace")}
              >
                Dossier parent
              </Button>
            )}
            <Button
              small
              disabled={!running || busy}
              icon={FilePlus2}
              onPress={() => {
                setNotice("");
                setEditor({
                  path: `${path}/note-${Date.now()}.txt`,
                  text: "",
                  saved: "",
                  savedPath: "",
                });
              }}
            >
              Nouveau fichier
            </Button>
            <Button
              small
              disabled={!running || busy}
              icon={FolderPlus}
              onPress={() => setFolder("")}
            >
              Nouveau dossier
            </Button>
            <Button
              small
              disabled={!running || busy}
              icon={RefreshCw}
              onPress={() => setRetry(retry + 1)}
            >
              Actualiser les fichiers
            </Button>
            <Button
              small
              disabled={!running || busy}
              icon={Upload}
              onPress={() => setImporting(!importing)}
            >
              {importing ? "Masquer les documents" : "Copier un document ici"}
            </Button>
          </View>
          {importing && (
            <Card>
              <Text style={s.heading}>Choisir un PDF enregistré</Text>
              <Text style={[s.small, { marginTop: 6 }]}>
                Le fichier sera copié dans ce dossier. Un fichier portant le même nom sera remplacé.
              </Text>
              {workspace.files.map((file) => (
                <LinkRow
                  key={file.id}
                  icon={FileText}
                  title={file.name}
                  onPress={() => void importDocument(file)}
                />
              ))}
              {!workspace.files.length && (
                <Text style={s.muted}>
                  Ajoutez d’abord un document depuis le courrier ou Fichiers.
                </Text>
              )}
            </Card>
          )}
          {folder !== undefined && (
            <Card style={{ gap: 8 }}>
              <Field
                label="Nom du dossier"
                value={folder}
                onChangeText={setFolder}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={[s.row, { gap: 8 }]}>
                <Button
                  primary
                  disabled={!running || !folder.trim()}
                  busy={busy}
                  onPress={() => void mkdir()}
                >
                  Créer le dossier
                </Button>
                <Button disabled={busy} onPress={() => setFolder(undefined)}>
                  Annuler
                </Button>
              </View>
            </Card>
          )}
          {running &&
            directory?.path === path &&
            directory.entries.map((entry) => (
              <LinkRow
                key={entry.path}
                icon={entry.type === "directory" ? Folder : FileText}
                title={entry.name}
                detail={
                  entry.type === "directory"
                    ? "Dossier"
                    : entry.type === "symlink"
                      ? "Lien symbolique"
                      : `${Math.max(1, Math.ceil(entry.size / 1024))} KB`
                }
                onPress={() => {
                  if (busy || loading || !running) return;
                  if (entry.type === "directory") {
                    setNotice("");
                    setPath(entry.path);
                  } else if (/\.pdf$/i.test(entry.name)) void openPdf(entry.path);
                  else void read(entry.path);
                }}
              />
            ))}
          {running &&
            !busy &&
            !loading &&
            !error &&
            directory?.path === path &&
            directory.entries.length === 0 && (
              <Empty
                icon={Folder}
                title="Un espace à créer"
                detail="Ajoutez un fichier ici ou demandez à votre assistant d’en créer un dans son espace."
              />
            )}
        </>
      )}
    </View>
  );
}
