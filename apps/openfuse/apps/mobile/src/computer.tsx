import {
  FileText,
  FolderOpen,
  Globe2,
  Monitor,
  Plus,
  RefreshCw,
  Terminal,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { AppState, Image, Pressable, Text, View } from "react-native";
import type { BrowserSession } from "../../../packages/domain/src";
import type { ComputerSnapshot } from "../../../packages/domain/src/computer";
import { browserAddress } from "./browser-address";
import { useComputerDraft } from "./computer-drafts";
import { computerStatus } from "./computer-status";
import { LinuxWorkspace } from "./computer-workspace";
import { frenchCount, frenchStatusLabel } from "./locale";
import { Button, Card, colors, ErrorNotice, Field, LinkRow, Sheet, s } from "./ui";
import { useWorkspace } from "./workspace";

export function ComputerEntry() {
  const { workspace, open } = useWorkspace();
  const available = workspace.connections.some(
    (c) => c.id === "browser" && c.status === "connected",
  );
  const active = workspace.browsers.filter((b) => b.status === "active").length;
  const status = computerStatus(available, active);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ordinateur de l’assistant — ${frenchStatusLabel(status)}`}
      onPress={() => open({ type: "computer" })}
      style={[
        s.row,
        {
          alignSelf: "center",
          gap: 6,
          paddingHorizontal: 12,
          paddingVertical: 7,
          borderRadius: 20,
          backgroundColor: colors.sky,
        },
      ]}
    >
      <Monitor size={13} color={colors.muted} />
      <Text style={{ fontSize: 12, color: colors.muted }}>
        Ordinateur · {frenchStatusLabel(status)}
      </Text>
      <View
        style={{
          width: 5,
          height: 5,
          borderRadius: 3,
          backgroundColor: available ? "#57AD85" : "#ACB0B5",
        }}
      />
    </Pressable>
  );
}
export function BrowserThreadCard({ browser }: { browser: BrowserSession }) {
  const { open } = useWorkspace();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [browser.previewUrl, browser.updatedAt]);
  return (
    <Card
      style={{ padding: 13, backgroundColor: colors.sky, gap: 12, maxWidth: 440, width: "100%" }}
    >
      <View style={[s.row, { gap: 10 }]}>
        <View style={[s.iconBox, { width: 36, height: 36, borderRadius: 9 }]}>
          <Globe2 size={21} color={colors.accentDark} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.text, { fontWeight: "600" }]}>Navigateur</Text>
          <Text numberOfLines={1} style={s.small}>
            {browser.status === "closed"
              ? "Session enregistrée"
              : browser.status === "error"
                ? "À vérifier"
                : browser.title}
          </Text>
        </View>
      </View>
      {browser.previewUrl && browser.status === "active" && !failed ? (
        <Image
          accessibilityLabel={`Aperçu du navigateur : ${browser.title}`}
          source={{ uri: browser.previewUrl }}
          style={{
            width: "100%",
            aspectRatio: 1.6,
            borderRadius: 11,
            backgroundColor: colors.card,
          }}
          resizeMode="contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <View
          style={{
            padding: 24,
            borderRadius: 12,
            backgroundColor: colors.card,
            alignItems: "center",
            gap: 10,
          }}
        >
          <Globe2 size={30} color={colors.muted} />
          <Text numberOfLines={2} style={[s.muted, { textAlign: "center" }]}>
            {failed
              ? "Aperçu indisponible. Ouvrez le navigateur pour vous reconnecter."
              : browser.url}
          </Text>
        </View>
      )}
      <Button onPress={() => open({ type: "browser", browser })}>
        {browser.status === "closed"
          ? "Rouvrir le navigateur"
          : browser.status === "error"
            ? "Reconnecter le navigateur"
            : "Prendre le contrôle"}
      </Button>
    </Card>
  );
}
const tabIcons = { Browser: Globe2, Desktop: Monitor, Terminal, Files: FolderOpen } as const;
const tabLabels = {
  Browser: "Navigateur",
  Desktop: "Bureau",
  Terminal: "Terminal",
  Files: "Fichiers",
} as const;
export function ComputerSheet() {
  const { workspace, api, refresh, close, open, navigate } = useWorkspace();
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useComputerDraft("tab");
  // Unknown until the first snapshot, so a remembered Desktop tab survives reopening.
  const [desktop, setDesktop] = useState<boolean>();
  const onSnapshot = useCallback((snapshot: ComputerSnapshot) => {
    // A transient provider error keeps the last known state instead of closing the tab.
    if (snapshot.status !== "error")
      setDesktop(snapshot.provider === "e2b-desktop" && snapshot.status === "running");
  }, []);
  // A remembered Desktop tab falls back to Terminal while the desktop is off; the draft
  // keeps "Desktop", so the tab returns by itself once the computer runs again.
  const shown = desktop === false && tab === "Desktop" ? "Terminal" : tab;
  const tabs = desktop
    ? (["Browser", "Desktop", "Terminal", "Files"] as const)
    : (["Browser", "Terminal", "Files"] as const);
  const available = workspace.connections.some(
    (c) => c.id === "browser" && c.status === "connected",
  );
  useEffect(() => {
    let active = true;
    const timer = setInterval(() => {
      if (AppState.currentState !== "active") return;
      void refresh().catch((e) => {
        if (active) setError(e instanceof Error ? e.message : String(e));
      });
    }, 10000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [refresh]);
  async function create() {
    if (busy || !url.trim()) return;
    setBusy(true);
    setError("");
    try {
      const browser = await api.request<BrowserSession>("/api/browsers", {
        url: browserAddress(url),
      });
      await refresh();
      open({ type: "browser", browser });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Sheet
      title="Ordinateur de l’assistant"
      subtitle="Alineo travaille ici. Vous pouvez reprendre la main à tout moment."
      onClose={close}
    >
      <View style={{ gap: 20 }}>
        {shown === "Browser" && (
          <View
            style={[s.row, { gap: 12, padding: 18, borderRadius: 20, backgroundColor: colors.sky }]}
          >
            <Monitor size={28} color={colors.accentDark} />
            <View style={{ flex: 1 }}>
              <Text style={s.heading}>
                {available ? "Navigateur connecté" : "Navigateur hors ligne"}
              </Text>
              <Text style={s.muted}>
                {available
                  ? "Retrouvez au même endroit le navigateur et les documents de votre assistant."
                  : "Démarrez le service du navigateur pour connecter cet ordinateur."}
              </Text>
            </View>
          </View>
        )}
        <View style={[s.row, { gap: 8, flexWrap: "wrap" }]}>
          {tabs.map((item) => (
            <Button
              key={item}
              primary={shown === item}
              icon={tabIcons[item]}
              onPress={() => setTab(item)}
            >
              {tabLabels[item]}
            </Button>
          ))}
        </View>
        <View style={{ display: shown === "Browser" ? "none" : "flex" }}>
          <LinuxWorkspace tab={shown === "Browser" ? "Terminal" : shown} onSnapshot={onSnapshot} />
        </View>
        <ErrorNotice error={error} />
        {shown === "Browser" ? (
          <>
            <View>
              <Field
                label="Adresse du site web"
                value={url}
                onChangeText={setUrl}
                placeholder="https://example.com"
                autoCapitalize="none"
                keyboardType="url"
                onSubmitEditing={() => void create()}
              />
              <Button
                primary
                icon={Plus}
                busy={busy}
                disabled={!available || !url.trim()}
                onPress={() => void create()}
              >
                Ouvrir une session de navigation
              </Button>
            </View>
            {[...workspace.browsers]
              .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
              .map((browser) => (
                <BrowserThreadCard key={browser.id} browser={browser} />
              ))}
            {!workspace.browsers.length && (
              <Text style={s.muted}>
                Ouvrez une page ici ou demandez à votre assistant de faire une recherche. Ses
                sessions de navigation apparaîtront ici.
              </Text>
            )}
            <Text style={s.small}>
              Chaque session conserve ses propres connexions et téléchargements. Ouvrez-en une pour
              reprendre la main, puis revenez à votre conversation.
            </Text>
          </>
        ) : tab === "Files" ? (
          <>
            <Text style={s.heading}>Documents</Text>
            <Text style={s.small}>
              PDF enregistrés depuis le courrier, téléchargés dans le navigateur ou importés.
            </Text>
            {workspace.files.map((file) => (
              <LinkRow
                key={file.id}
                icon={FileText}
                title={file.name}
                detail={`${frenchCount(file.pageCount, "page")} · PDF`}
                onPress={() => open({ type: "file", file })}
              />
            ))}
            <Button
              icon={Plus}
              onPress={() => {
                close();
                navigate("files");
              }}
            >
              Importer un document
            </Button>
          </>
        ) : null}
        <Button
          small
          icon={RefreshCw}
          onPress={() =>
            void refresh()
              .then(() => setError(""))
              .catch((e) => setError(String(e)))
          }
        >
          Actualiser l’ordinateur
        </Button>
      </View>
    </Sheet>
  );
}
