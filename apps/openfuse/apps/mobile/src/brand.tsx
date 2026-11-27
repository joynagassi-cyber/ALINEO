import { Image, Text, View } from "react-native";
import alineoMark from "../assets/alineo-flow-mark.png";
import { colors } from "./design-tokens";

/** Alineo's flowing mark and typographic lockup, shared by the welcome screen and navigation. */
export function BrandLogo({
  size = 44,
  showTagline = false,
  centered = false,
}: {
  size?: number;
  showTagline?: boolean;
  centered?: boolean;
}) {
  const wordmarkSize = size * (showTagline ? 0.43 : 0.44);
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={showTagline ? "Alineo. Tout votre quotidien, mieux aligné." : "Alineo"}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: centered ? "center" : "flex-start",
        gap: Math.max(9, size * 0.18),
      }}
    >
      <Image
        accessible={false}
        source={alineoMark}
        resizeMode="cover"
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.26,
          borderWidth: 1,
          borderColor: colors.line,
        }}
      />
      <View importantForAccessibility="no-hide-descendants" style={{ gap: showTagline ? 3 : 0 }}>
        <Text
          style={{
            color: colors.text,
            fontSize: wordmarkSize,
            fontWeight: "700",
            letterSpacing: -wordmarkSize * 0.05,
            lineHeight: wordmarkSize * 1.13,
          }}
        >
          Alineo
        </Text>
        {showTagline && (
          <Text
            style={{
              color: colors.muted,
              fontSize: Math.max(11, size * 0.16),
              lineHeight: Math.max(15, size * 0.22),
              letterSpacing: 0.1,
            }}
          >
            Tout votre quotidien, mieux aligné.
          </Text>
        )}
      </View>
    </View>
  );
}
