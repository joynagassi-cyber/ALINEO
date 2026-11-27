import { ArrowUpRight, Check, ChevronRight, type LucideIcon, X } from "lucide-react-native";
import {
  createElement,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "./design-tokens";
import { MicOrb, type MicOrbAppearance, type MicOrbState } from "./mic-orb";

export { colors } from "./design-tokens";
export const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  between: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  text: { color: colors.text, fontSize: 15, lineHeight: 23 },
  muted: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  small: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "600",
    letterSpacing: -0.7,
    lineHeight: 32,
  },
  heading: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.25,
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 20,
    shadowColor: "#000000",
    shadowOpacity: Platform.OS === "web" ? 0.18 : 0.24,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 16 },
  input: {
    borderWidth: 1,
    borderColor: colors.control,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 16,
    backgroundColor: colors.card,
    minHeight: 48,
  },
  field: { gap: 8, marginBottom: 16 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    minHeight: 44,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  srOnly: {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    opacity: 0,
  },
  primary: { backgroundColor: colors.accent },
  secondary: { backgroundColor: colors.disabled },
  buttonText: { fontSize: 14, fontWeight: "600" },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9,
    alignSelf: "flex-start",
    backgroundColor: colors.raised,
  },
  chipText: { fontSize: 12, lineHeight: 16, fontWeight: "600", color: colors.muted },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.sky,
  },
  error: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.errorSurface,
    marginVertical: 10,
    gap: 4,
  },
  modalShade: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  sheet: {
    backgroundColor: colors.canvas,
    borderRadius: 26,
    width: "100%",
    maxWidth: 790,
    maxHeight: "94%",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.line,
  },
});
export function Heading({
  children,
  level = 2,
  style,
}: {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  style?: TextInputProps["style"];
}) {
  const semanticProps =
    Platform.OS === "web"
      ? { role: "heading" as const, "aria-level": level }
      : { accessibilityRole: "header" as const };
  return (
    <Text {...semanticProps} style={style}>
      {children}
    </Text>
  );
}
export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ gap: 6, marginBottom: 22 }}>
      <Heading level={1} style={s.title}>
        {title}
      </Heading>
      {!!subtitle && <Text style={s.muted}>{subtitle}</Text>}
    </View>
  );
}
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (Platform.OS === "web" && typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    // Avoid an animated first presentation while the native preference is loading.
    return Platform.OS !== "web";
  });
  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined" && window.matchMedia) {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      const update = (event: MediaQueryListEvent) => setReduced(event.matches);
      setReduced(media.matches);
      media.addEventListener?.("change", update);
      return () => media.removeEventListener?.("change", update);
    }
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (active) setReduced(value);
    });
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduced);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  return reduced;
}
export function Button({
  children,
  onPress,
  icon: Icon,
  primary,
  disabled,
  busy,
  small,
  danger,
  selected,
  hint,
  style,
}: {
  children: ReactNode;
  onPress: () => void;
  icon?: LucideIcon;
  primary?: boolean;
  disabled?: boolean;
  busy?: boolean;
  small?: boolean;
  danger?: boolean;
  selected?: boolean;
  hint?: string;
  style?: ViewStyle;
}) {
  const [focused, setFocused] = useState(false);
  const unavailable = !!(disabled || busy);
  const color = unavailable ? colors.muted : danger ? colors.danger : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={unavailable}
      accessibilityState={{ disabled: unavailable, busy: !!busy, selected }}
      accessibilityHint={hint}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        primary ? s.primary : s.secondary,
        small && { minHeight: 44, paddingVertical: 8, paddingHorizontal: 13 },
        unavailable && { backgroundColor: colors.disabled, borderColor: colors.control },
        focused && { borderColor: colors.focus },
        pressed && !unavailable && { transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={color} size="small" />
      ) : Icon ? (
        <Icon size={15} color={color} />
      ) : null}
      <Text style={[s.buttonText, { color }]}>{children}</Text>
    </Pressable>
  );
}
export function IconButton({
  icon: Icon,
  label,
  onPress,
  hint,
  nativeID,
}: {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  hint?: string;
  nativeID?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      nativeID={nativeID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: 40,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
          borderWidth: 2,
          borderColor: focused ? colors.focus : "transparent",
          backgroundColor: pressed ? colors.line : colors.card,
        },
      ]}
    >
      <Icon size={20} strokeWidth={1.8} color={colors.text} />
    </Pressable>
  );
}
export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[s.card, style]}>{children}</View>;
}
export function Chip({ children, tint }: { children: ReactNode; tint?: string }) {
  return (
    <View style={[s.chip, tint ? { backgroundColor: tint } : null]}>
      <Text style={s.chipText}>{children}</Text>
    </View>
  );
}
export function Field({
  label,
  error,
  hint,
  required,
  bare,
  containerStyle,
  labelStyle,
  ...props
}: TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  bare?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextInputProps["style"];
}) {
  const [focused, setFocused] = useState(false);
  const generatedId = useId().replace(/:/g, "");
  const inputId = `alineo-field-${generatedId}`;
  const labelId = `${inputId}-label`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedBy = [hint ? hintId : "", error ? errorId : ""].filter(Boolean).join(" ");
  const {
    onFocus,
    onBlur,
    style: inputStyle,
    accessibilityHint,
    accessibilityLabel,
    ...inputProps
  } = props;
  const inputAriaProps =
    Platform.OS === "web"
      ? {
          "aria-invalid": !!error,
          "aria-describedby": describedBy || undefined,
          "aria-required": !!required,
        }
      : {};
  const labelText = required ? `${label} (required)` : label;
  const fieldLabel =
    Platform.OS === "web" ? (
      createElement(
        "label",
        {
          htmlFor: inputId,
          id: labelId,
          style: {
            display: "block",
            color: colors.text,
            fontSize: 12,
            fontWeight: 600,
            lineHeight: "18px",
          },
        },
        labelText,
      )
    ) : (
      <Text
        nativeID={labelId}
        accessibilityRole="text"
        style={[s.small, { fontWeight: "600", color: colors.text }, labelStyle]}
      >
        {labelText}
      </Text>
    );
  return (
    <View style={[s.field, containerStyle]}>
      {fieldLabel}
      {!!hint && (
        <Text nativeID={hintId} style={[s.small, { marginTop: -3 }]}>
          {hint}
        </Text>
      )}
      <TextInput
        nativeID={inputId}
        placeholderTextColor={colors.muted}
        accessibilityLabel={accessibilityLabel || labelText}
        accessibilityLabelledBy={labelId}
        accessibilityHint={error ? `Error: ${error}` : accessibilityHint || hint}
        {...inputAriaProps}
        {...inputProps}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[
          bare ? { color: colors.text, fontSize: 16, backgroundColor: "transparent" } : s.input,
          !bare && focused && { borderWidth: 2, borderColor: colors.focus },
          !bare && !!error && { borderColor: colors.danger },
          props.multiline && !bare && { minHeight: 120, textAlignVertical: "top" },
          props.multiline && bare && { textAlignVertical: "top" },
          inputStyle,
        ]}
      />
      {!!error && (
        <Text
          nativeID={errorId}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          style={[s.small, { color: colors.danger, marginTop: -3 }]}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
export function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue = (next) => String(next),
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}) {
  const [width, setWidth] = useState(1);
  const commit = useCallback(
    (candidate: number) => {
      const precision = step.toString().split(".")[1]?.length ?? 0;
      const snapped = min + Math.round((candidate - min) / step) * step;
      onChange(Number(Math.max(min, Math.min(max, snapped)).toFixed(precision)));
    },
    [max, min, onChange, step],
  );
  const updateFromPosition = useCallback(
    (x: number) => {
      const trackWidth = Math.max(0, width - 20);
      if (trackWidth > 0)
        commit(min + (Math.max(0, Math.min(trackWidth, x - 10)) / trackWidth) * (max - min));
    },
    [commit, max, min, width],
  );
  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (event) => updateFromPosition(event.nativeEvent.locationX),
        onPanResponderMove: (event) => updateFromPosition(event.nativeEvent.locationX),
      }),
    [updateFromPosition],
  );
  const progress = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const control =
    Platform.OS === "web" ? (
      createElement("input", {
        type: "range",
        min,
        max,
        step,
        value,
        "aria-label": label,
        onChange: (event) => onChange(Number(event.currentTarget.value)),
        style: { width: "100%", accentColor: colors.accentDark, margin: 0 },
      })
    ) : (
      <View
        accessible
        accessibilityLabel={label}
        accessibilityRole="adjustable"
        accessibilityValue={{ min, max, now: value }}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={({ nativeEvent }) =>
          commit(value + (nativeEvent.actionName === "increment" ? step : -step))
        }
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        {...responder.panHandlers}
        style={{ height: 34, justifyContent: "center" }}
      >
        <View
          style={{
            height: 4,
            marginHorizontal: 10,
            borderRadius: 3,
            backgroundColor: colors.line,
          }}
        />
        <View
          style={{
            position: "absolute",
            left: 10,
            width: Math.max(0, width - 20) * progress,
            height: 4,
            borderRadius: 3,
            backgroundColor: colors.accentDark,
          }}
        />
        <View
          style={{
            position: "absolute",
            left: 10 + Math.max(0, width - 20) * progress,
            width: 18,
            height: 18,
            marginLeft: -9,
            borderRadius: 9,
            borderWidth: 2,
            borderColor: colors.accentDark,
            backgroundColor: colors.card,
          }}
        />
      </View>
    );

  return (
    <View style={{ gap: 3 }}>
      <View style={s.between}>
        <Text style={[s.small, { color: colors.text, fontWeight: "600" }]}>{label}</Text>
        <Text style={s.small}>{formatValue(value)}</Text>
      </View>
      {control}
    </View>
  );
}
export function LoadingNotice({ label, centered = false }: { label: string; centered?: boolean }) {
  return (
    <View
      role="status"
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityLiveRegion="polite"
      style={[
        s.row,
        {
          gap: 10,
          paddingVertical: centered ? 32 : 8,
          justifyContent: centered ? "center" : "flex-start",
        },
      ]}
    >
      <ActivityIndicator accessible={false} color={colors.accentDark} />
      <Text style={s.muted}>{label}</Text>
    </View>
  );
}
export function Empty({
  icon: Icon,
  title,
  detail,
  children,
}: {
  icon: LucideIcon;
  title: string;
  detail: string;
  children?: ReactNode;
}) {
  return (
    <View style={{ alignItems: "center", padding: 32, gap: 13 }}>
      <View accessible={false} style={[s.iconBox, { width: 56, height: 56, borderRadius: 18 }]}>
        <Icon size={24} color={colors.accentDark} />
      </View>
      <Heading level={2} style={s.heading}>
        {title}
      </Heading>
      <Text style={[s.muted, { textAlign: "center", maxWidth: 360 }]}>{detail}</Text>
      {children}
    </View>
  );
}
export function ErrorNotice({ error }: { error?: string }) {
  return error ? (
    <View
      role="alert"
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
      style={[s.error, { backgroundColor: colors.errorSurface }]}
    >
      <Text style={[s.text, { color: colors.danger }]}>{error}</Text>
    </View>
  ) : null;
}
export function Sheet({
  title,
  subtitle,
  children,
  onClose,
  wide,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const compact = width < 600;
  return (
    <Modal
      transparent
      animationType={reducedMotion ? "none" : compact ? "slide" : "fade"}
      visible
      onRequestClose={onClose}
    >
      <View style={[s.modalShade, compact && { padding: 0, justifyContent: "flex-end" }]}>
        <View
          role="dialog"
          aria-modal={true}
          accessibilityViewIsModal
          accessibilityLabel={title}
          style={[
            s.sheet,
            wide && { maxWidth: 1050 },
            compact && {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              paddingBottom: Math.max(insets.bottom, 12),
              maxHeight: "94%",
            },
          ]}
        >
          {compact && (
            <View
              accessible={false}
              style={{
                alignSelf: "center",
                width: 34,
                height: 4,
                borderRadius: 3,
                backgroundColor: colors.line,
                marginTop: 10,
              }}
            />
          )}
          <View
            style={[
              s.between,
              { padding: compact ? 20 : 24, borderBottomWidth: 1, borderBottomColor: colors.line },
            ]}
          >
            <View style={{ flex: 1, gap: 4 }}>
              <Heading level={1} style={s.title}>
                {title}
              </Heading>
              {!!subtitle && <Text style={s.muted}>{subtitle}</Text>}
            </View>
            <IconButton icon={X} label="Fermer les détails" onPress={onClose} />
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: compact ? 20 : 24 }}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
export function CheckRow({
  label,
  checked,
  onPress,
  hint,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
  hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ checked }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={onPress}
      style={({ pressed }) => [
        s.row,
        {
          gap: 10,
          paddingHorizontal: 4,
          minHeight: 44,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: focused ? colors.focus : "transparent",
          backgroundColor: pressed ? colors.sky : "transparent",
        },
      ]}
    >
      <View
        accessible={false}
        style={{
          width: 20,
          height: 20,
          borderRadius: 5,
          borderWidth: 2,
          borderColor: checked ? colors.accentDark : colors.control,
          backgroundColor: checked ? colors.accentDark : colors.card,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {checked && <Check size={13} color={colors.canvas} />}
      </View>
      <Text style={[s.text, { flex: 1 }]}>{label}</Text>
    </Pressable>
  );
}
export function SectionHeading({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[s.between, { marginBottom: 16, gap: 10 }]}>
      <Heading level={2} style={s.heading}>
        {title}
      </Heading>
      {action && onPress && (
        <Pressable
          accessibilityRole="button"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onPress={onPress}
          style={({ pressed }) => [
            s.row,
            {
              gap: 5,
              minHeight: 44,
              paddingHorizontal: 6,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: focused ? colors.focus : "transparent",
              backgroundColor: pressed ? colors.sky : "transparent",
            },
          ]}
        >
          <Text style={[s.small, { color: colors.text }]}>{action}</Text>
          <ArrowUpRight size={13} color={colors.muted} />
        </Pressable>
      )}
    </View>
  );
}
export function LinkRow({
  title,
  detail,
  onPress,
  icon: Icon,
  tint,
}: {
  title: string;
  detail?: string;
  onPress: () => void;
  icon: LucideIcon;
  tint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={detail ? `${title}. ${detail}` : title}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={onPress}
      style={({ pressed }) => [
        s.row,
        {
          minHeight: 52,
          paddingVertical: 8,
          paddingHorizontal: 4,
          gap: 14,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: focused ? colors.focus : "transparent",
        },
        pressed && { backgroundColor: colors.canvas },
      ]}
    >
      <View accessible={false} style={[s.iconBox, { backgroundColor: tint || colors.sky }]}>
        <Icon size={19} color={colors.text} />
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={[s.text, { fontWeight: "500" }]}>{title}</Text>
        {!!detail && <Text style={s.small}>{detail}</Text>}
      </View>
      <ChevronRight size={15} color={colors.muted} />
    </Pressable>
  );
}
/** OpenDuet's animated MicOrb, shared by every Alineo assistant surface. */
export function Mascot({
  size = 42,
  variant = "sky",
  state = "idle",
  appearance,
  accessible = true,
}: {
  size?: number;
  variant?: "sky" | "sand" | "lilac";
  state?: MicOrbState;
  appearance?: Partial<MicOrbAppearance>;
  accessible?: boolean;
}) {
  const palette = {
    sky: "alineo",
    sand: "ember",
    lilac: "graphite",
  } as const;
  return (
    <MicOrb
      size={size}
      palette={appearance?.palette ?? palette[variant]}
      state={state}
      appearance={appearance}
      accessible={accessible}
    />
  );
}
export function dateLabel(value: string, options?: Intl.DateTimeFormatOptions) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("fr-FR", options || { month: "short", day: "numeric" });
}
export function timeLabel(value: string, timeZone?: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone,
      });
}
export { relativeDate } from "./relative-date";

export function resultSummary(value: string) {
  return /^Saved to (?:sample|local) sent mail(?: · .+)?$/.test(value)
    ? "Réponse enregistrée dans vos messages envoyés locaux."
    : value;
}
