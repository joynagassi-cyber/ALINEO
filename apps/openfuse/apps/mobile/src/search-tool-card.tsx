import { Search } from "lucide-react-native";
import { useContext, useState } from "react";
import { ActivityIndicator, Linking, Text, View } from "react-native";
import { z } from "zod";
import { BrowserRunContext } from "./browser-tool-card";
import { Card, colors, ErrorNotice, s } from "./ui";

const resultSchema = z.object({
  results: z.array(z.object({ url: z.url({ protocol: /^https?$/ }), title: z.string().nullish() })),
  warnings: z.array(z.string()),
  truncated: z.boolean(),
});

export function SearchToolCard({ result, loading }: { result: unknown; loading: boolean }) {
  const { active } = useContext(BrowserRunContext);
  const [linkError, setLinkError] = useState("");
  let value = result;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      value = undefined;
    }
  }
  const error = z.object({ error: z.string() }).safeParse(value);
  const parsed = resultSchema.safeParse(value);
  const working = loading && active;
  const failure = error.success
    ? error.data.error
    : !loading && !parsed.success
      ? "La recherche n’a pas renvoyé de résultats lisibles."
      : "";
  const sources = parsed.success
    ? [...new Map(parsed.data.results.map((source) => [source.url, source])).values()]
    : [];
  const count = sources.length;
  return (
    <Card
      style={{ padding: 14, gap: 10, backgroundColor: colors.sky, maxWidth: 440, width: "100%" }}
    >
      <View style={[s.row, { gap: 10 }]}>
        {working ? (
          <ActivityIndicator size="small" color={colors.accentDark} />
        ) : (
          <Search size={18} color={colors.accentDark} />
        )}
        <Text style={s.text}>
          {failure
            ? "La recherche a échoué"
            : working
              ? "Recherche sur le Web…"
              : loading
                ? "Recherche interrompue"
                : count
                  ? `${count} source${count > 1 ? "s" : ""} trouvée${count > 1 ? "s" : ""}`
                  : "Aucune source trouvée"}
        </Text>
      </View>
      {!loading && parsed.success && (
        <>
          {sources.map((source) => (
            <Text
              key={source.url}
              accessibilityRole="link"
              style={[s.text, { color: colors.accentDark }]}
              onPress={() => {
                setLinkError("");
                void Linking.openURL(source.url).catch(() =>
                  setLinkError("Impossible d’ouvrir cette source."),
                );
              }}
            >
              {source.title || source.url}
            </Text>
          ))}
          {parsed.data.truncated && (
            <Text style={s.small}>Certains résultats ou extraits de recherche ont été omis.</Text>
          )}
          {[...new Set(parsed.data.warnings)].map((warning) => (
            <Text key={warning} style={s.small}>
              {warning}
            </Text>
          ))}
        </>
      )}
      <ErrorNotice error={failure || linkError} />
    </Card>
  );
}
