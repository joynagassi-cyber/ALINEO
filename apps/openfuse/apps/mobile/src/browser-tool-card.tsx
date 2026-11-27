import { Check, Globe2, Hand, RotateCw } from "lucide-react-native";
import { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, AppState, Image, Text, View } from "react-native";
import { z } from "zod";
import type { BrowserSession } from "../../../packages/domain/src";
import { Button, Card, colors, ErrorNotice, s } from "./ui";
import { useWorkspace } from "./workspace";

export const BrowserRunContext = createContext({ running: false, active: false });

const observationSchema = z.object({
  sessionId: z.string(),
  title: z.string(),
  url: z.url(),
});

function resultValue(result: unknown) {
  if (typeof result !== "string") return result;
  try {
    return JSON.parse(result);
  } catch {
    return undefined;
  }
}

function siteLabel(url: unknown) {
  if (typeof url !== "string") return "Ouverture d’une page";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Ouverture d’une page";
  }
}

/** A server tool result stays with the request that produced it, including on replay. */
export function BrowserToolCard({
  url,
  result,
  loading,
}: {
  url: unknown;
  result: unknown;
  loading: boolean;
}) {
  const { api, workspace, open } = useWorkspace();
  const { running, active } = useContext(BrowserRunContext);
  const working = loading && active;
  const value = resultValue(result);
  const observation = observationSchema.safeParse(value);
  const toolError = z.object({ error: z.string() }).safeParse(value);
  const sessionId = observation.success ? observation.data.sessionId : undefined;
  const current = workspace.browsers.find((browser) => browser.id === sessionId);
  const [browser, setBrowser] = useState<BrowserSession>();
  const [error, setError] = useState("");
  const [previewFailed, setPreviewFailed] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!sessionId) return;
    let active = true;
    async function connect() {
      setError("");
      setPreviewFailed(false);
      try {
        const session = await api.request<BrowserSession>(
          `/api/browsers/${encodeURIComponent(sessionId || "")}`,
        );
        if (active) setBrowser(session);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : String(e));
      }
    }
    void connect();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void connect();
    });
    return () => {
      active = false;
      subscription.remove();
    };
  }, [api, sessionId, current?.updatedAt, retry]);

  const visited = observation.success ? observation.data : undefined;
  // A later turn can reuse the same browser. Never label that new page as an old source.
  const preview =
    browser?.status === "active" && browser.url === visited?.url && !previewFailed
      ? browser.previewUrl
      : undefined;
  const failure = toolError.success
    ? toolError.data.error
    : !loading && !visited
      ? "Le navigateur n’a pas renvoyé de page. Réessayez votre demande."
      : "";
  return (
    <Card
      style={{ padding: 13, backgroundColor: colors.sky, gap: 12, width: "100%", maxWidth: 440 }}
    >
      <View style={[s.row, { gap: 10 }]}>
        <View style={[s.iconBox, { width: 36, height: 36, borderRadius: 10 }]}>
          <Globe2 size={21} color={colors.accentDark} />
        </View>
        <View style={{ flex: 1, gap: 1 }}>
          <Text style={[s.text, { fontWeight: "600" }]}>Navigateur</Text>
          <Text numberOfLines={1} style={[s.small, { fontSize: 12 }]}>
            {working
              ? "Lecture de la page…"
              : loading
                ? "Navigation en pause"
                : failure
                  ? "Impossible de lire la page"
                  : siteLabel(visited?.url)}
          </Text>
        </View>
        {working ? (
          <ActivityIndicator size="small" color={colors.accentDark} />
        ) : visited ? (
          <Check size={17} color={colors.accentDark} accessibilityLabel="Page lue" />
        ) : null}
      </View>
      {preview ? (
        <Image
          accessibilityLabel={`Aperçu du navigateur : ${visited?.title}`}
          source={{ uri: api.url(preview) }}
          style={{
            width: "100%",
            aspectRatio: 1.7,
            borderRadius: 12,
            backgroundColor: colors.card,
          }}
          resizeMode="contain"
          onError={() => setPreviewFailed(true)}
        />
      ) : (
        <View style={{ backgroundColor: colors.sky, borderRadius: 12, padding: 21, gap: 12 }}>
          <Text numberOfLines={2} style={[s.text, { fontSize: 14 }]}>
            {visited?.title || siteLabel(url)}
          </Text>
          {working ? (
            <View style={{ gap: 8 }}>
              {(["90%", "74%", "84%"] as const).map((width) => (
                <View
                  key={width}
                  style={{ height: 7, width, borderRadius: 4, backgroundColor: colors.line }}
                />
              ))}
            </View>
          ) : visited ? (
            <Text style={s.small}>
              {browser && browser.url !== visited.url
                ? "Page consultée. Le navigateur a continué sa navigation."
                : browser?.status === "closed"
                  ? "Session enregistrée. Reprenez la main pour la rouvrir."
                  : browser?.status === "error"
                    ? "La session nécessite votre attention. Reprenez la main pour vous reconnecter."
                    : previewFailed
                      ? "Aperçu indisponible. Vous pouvez toujours reprendre la main."
                      : "Connexion à la session enregistrée…"}
            </Text>
          ) : null}
        </View>
      )}
      <ErrorNotice error={failure || error} />
      {!loading && visited && (
        <Button
          icon={Hand}
          disabled={!browser || running}
          onPress={() => browser && open({ type: "browser", browser })}
          style={{ backgroundColor: colors.card, minHeight: 38, paddingVertical: 8 }}
        >
          Reprendre la main
        </Button>
      )}
      {!!error && (
        <Button small icon={RotateCw} onPress={() => setRetry((attempt) => attempt + 1)}>
          Reconnecter l’aperçu
        </Button>
      )}
    </Card>
  );
}
