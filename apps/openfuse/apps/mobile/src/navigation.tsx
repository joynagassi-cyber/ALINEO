import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe2,
  Lightbulb,
  type LucideIcon,
  Mail,
  Menu,
  MessageCircle,
  Monitor,
  MoreHorizontal,
  PanelsTopLeft,
  Shapes,
  X,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Section } from "../../../packages/domain/src";
import { BrandLogo } from "./brand";
import { colors, IconButton, Mascot, s, useReducedMotion } from "./ui";

const primarySections: { id: Section; label: string; icon: LucideIcon }[] = [
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "activity", label: "Activité", icon: PanelsTopLeft },
  { id: "ideas", label: "Idées", icon: Lightbulb },
  { id: "goals", label: "Projets", icon: PanelsTopLeft },
  { id: "apps", label: "Applications", icon: Shapes },
];
const workspaceSections: { id: Section; label: string; icon: LucideIcon }[] = [
  { id: "mail", label: "Courrier", icon: Mail },
  { id: "calendar", label: "Calendrier", icon: CalendarDays },
  { id: "browser", label: "Navigateur", icon: Globe2 },
  { id: "files", label: "Fichiers", icon: FileText },
];

function NavigationItem({
  label,
  icon: Icon,
  active = false,
  count,
  variant = "sidebar",
  action = false,
  compact = false,
  nativeID,
  onPress,
}: {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  count?: number;
  variant?: "sidebar" | "bottom";
  action?: boolean;
  compact?: boolean;
  nativeID?: string;
  onPress: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const bottom = variant === "bottom";
  const accessibleLabel = `${label}${active ? ", section actuelle" : ""}${count ? `, ${count} élément${count > 1 ? "s" : ""} en attente` : ""}`;
  return (
    <Pressable
      nativeID={nativeID}
      accessibilityRole={bottom && !action && Platform.OS !== "web" ? "tab" : "button"}
      accessibilityLabel={accessibleLabel}
      accessibilityState={Platform.OS === "web" ? undefined : { selected: active }}
      aria-current={Platform.OS === "web" && active ? "page" : undefined}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={onPress}
      style={({ pressed }) =>
        bottom
          ? {
              flex: 1,
              minWidth: 0,
              minHeight: 58,
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              paddingHorizontal: 2,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: focused ? colors.focus : "transparent",
              backgroundColor: active ? colors.selected : pressed ? colors.raised : "transparent",
            }
          : compact
            ? {
                width: 46,
                minHeight: 42,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                borderWidth: 2,
                borderColor: focused ? colors.focus : "transparent",
                backgroundColor: active ? colors.selected : pressed ? colors.raised : "transparent",
              }
            : {
                width: "100%",
                minHeight: 42,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingHorizontal: 10,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: focused ? colors.focus : "transparent",
                backgroundColor: active ? colors.selected : pressed ? colors.raised : "transparent",
              }
      }
    >
      {!bottom && active && (
        <View
          accessible={false}
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 4,
            top: 11,
            bottom: 11,
            width: 3,
            borderRadius: 3,
            backgroundColor: colors.accentDark,
          }}
        />
      )}
      <View
        accessible={false}
        style={
          bottom
            ? { width: 24, height: 24, alignItems: "center", justifyContent: "center" }
            : {
                width: 30,
                height: 30,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                backgroundColor: active ? colors.card : "transparent",
              }
        }
      >
        <Icon
          size={bottom ? 20 : 18}
          strokeWidth={1.9}
          color={active ? colors.accentDark : colors.muted}
        />
        {!!count && (
          <View
            style={{
              position: "absolute",
              top: -5,
              right: -8,
              minWidth: 17,
              height: 17,
              paddingHorizontal: 4,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 9,
              backgroundColor: colors.danger,
            }}
          >
            <Text style={{ color: colors.card, fontSize: 10, lineHeight: 14, fontWeight: "700" }}>
              {count > 99 ? "99+" : count}
            </Text>
          </View>
        )}
      </View>
      {!compact && (
        <Text
          numberOfLines={1}
          style={
            bottom
              ? {
                  maxWidth: "100%",
                  color: active ? colors.text : colors.muted,
                  fontSize: 12,
                  lineHeight: 16,
                  fontWeight: active ? "700" : "500",
                }
              : {
                  flex: 1,
                  color: colors.text,
                  fontSize: 14,
                  lineHeight: 20,
                  fontWeight: active ? "700" : "500",
                }
          }
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
function GroupLabel({ children }: { children: string }) {
  return (
    <Text
      style={[
        s.label,
        { paddingHorizontal: 12, marginTop: 7, marginBottom: 5, fontSize: 10, letterSpacing: 1.1 },
      ]}
    >
      {children}
    </Text>
  );
}

function AssistantIdentityCard({
  agentName,
  status,
  avatar,
  appearance,
}: {
  agentName: string;
  status: string;
  avatar?: "sky" | "sand" | "lilac";
  appearance?: Parameters<typeof Mascot>[0]["appearance"];
}) {
  return (
    <View
      style={{
        padding: 13,
        borderRadius: 13,
        backgroundColor: colors.raised,
        borderWidth: 1,
        borderColor: colors.line,
        gap: 12,
      }}
    >
      <View style={[s.between, { gap: 10 }]}>
        <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
          <Text
            style={{
              color: colors.accentDark,
              fontSize: 9,
              lineHeight: 13,
              fontWeight: "800",
              letterSpacing: 1.1,
            }}
          >
            VOTRE ASSISTANT
          </Text>
          <Text
            numberOfLines={1}
            style={{ color: colors.text, fontSize: 17, lineHeight: 22, fontWeight: "700" }}
          >
            {agentName}
          </Text>
        </View>
        <View
          style={{
            width: 46,
            height: 46,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.line,
          }}
        >
          <Mascot size={38} variant={avatar} appearance={appearance} accessible={false} />
        </View>
      </View>
      <View style={[s.row, { gap: 8, alignItems: "flex-start" }]}>
        <View
          accessible={false}
          style={{
            width: 7,
            height: 7,
            borderRadius: 4,
            marginTop: 5,
            backgroundColor: colors.accentDark,
          }}
        />
        <Text
          numberOfLines={2}
          style={{ flex: 1, color: colors.muted, fontSize: 12, lineHeight: 17 }}
        >
          {status}
        </Text>
      </View>
    </View>
  );
}

function NotificationShortcut({ pending, onPress }: { pending: number; onPress: () => void }) {
  const summary =
    pending > 0 ? `${pending} élément${pending > 1 ? "s" : ""} à consulter` : "Tout est à jour";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        pending > 0 ? `Ouvrir les notifications, ${summary}` : "Ouvrir les notifications"
      }
      accessibilityHint="Consulter les résultats et les éléments à valider."
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 10,
        borderRadius: 12,
        backgroundColor: pressed ? colors.selected : colors.raised,
        borderWidth: 1,
        borderColor: colors.line,
      })}
    >
      <View
        accessible={false}
        style={{
          width: 36,
          height: 36,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
          backgroundColor: colors.card,
        }}
      >
        <Bell size={18} color={colors.accentDark} />
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Text style={{ color: colors.text, fontSize: 13, lineHeight: 18, fontWeight: "700" }}>
          Notifications
        </Text>
        <Text numberOfLines={1} style={s.small}>
          {summary}
        </Text>
      </View>
      {pending > 0 ? (
        <View
          style={{
            minWidth: 24,
            height: 24,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 6,
            borderRadius: 12,
            backgroundColor: colors.danger,
          }}
        >
          <Text style={{ color: colors.card, fontSize: 11, lineHeight: 15, fontWeight: "700" }}>
            {pending > 99 ? "99+" : pending}
          </Text>
        </View>
      ) : (
        <ChevronRight size={17} color={colors.muted} />
      )}
    </Pressable>
  );
}

export function DesktopSidebar({
  section,
  agentName,
  status,
  avatar,
  appearance,
  workspaceName,
  pending,
  collapsed,
  onToggleCollapse,
  navigate,
  onOpenThreads,
  onOpenNotifications,
  onOpenComputer,
}: {
  section: Section;
  agentName: string;
  status: string;
  avatar?: "sky" | "sand" | "lilac";
  appearance?: Parameters<typeof Mascot>[0]["appearance"];
  workspaceName: string;
  pending: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  navigate: (section: Section) => void;
  onOpenThreads: () => void;
  onOpenNotifications: () => void;
  onOpenComputer: () => void;
}) {
  return (
    <View
      role="navigation"
      accessibilityLabel="Navigation de l’espace de travail"
      style={{
        width: collapsed ? 68 : 236,
        flexShrink: 0,
        backgroundColor: colors.card,
        borderRightWidth: 1,
        borderRightColor: colors.line,
      }}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            paddingHorizontal: collapsed ? 12 : 18,
            paddingTop: 18,
            paddingBottom: 14,
            gap: collapsed ? 12 : 17,
            alignItems: collapsed ? "center" : undefined,
          }}
        >
          {collapsed ? (
            <>
              <BrandLogo size={28} />
              <IconButton
                icon={ChevronRight}
                label="Développer la navigation"
                hint="Afficher les noms des sections et les détails de l’espace."
                onPress={onToggleCollapse}
              />
              <Mascot size={40} variant={avatar} appearance={appearance} />
            </>
          ) : (
            <>
              <View style={[s.row, { justifyContent: "space-between", gap: 8 }]}>
                <BrandLogo size={40} />
                <IconButton
                  icon={ChevronLeft}
                  label="Replier la navigation"
                  hint="Réduire la barre latérale aux icônes."
                  onPress={onToggleCollapse}
                />
              </View>
              <AssistantIdentityCard
                agentName={agentName}
                status={status}
                avatar={avatar}
                appearance={appearance}
              />
            </>
          )}
        </View>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingBottom: 14,
            gap: 5,
            alignItems: collapsed ? "center" : undefined,
          }}
        >
          {!collapsed && <GroupLabel>Votre espace</GroupLabel>}
          {primarySections.map((item) => (
            <NavigationItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              active={section === item.id}
              compact={collapsed}
              onPress={() => navigate(item.id)}
            />
          ))}
          <NavigationItem
            label="Conversations"
            icon={MessageCircle}
            compact={collapsed}
            onPress={onOpenThreads}
          />
          <View
            style={
              collapsed
                ? { width: 36, height: 1, backgroundColor: colors.line, marginVertical: 12 }
                : [s.divider, { marginVertical: 12 }]
            }
          />
          {!collapsed && <GroupLabel>Vos outils</GroupLabel>}
          {workspaceSections.map((item) => (
            <NavigationItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              active={section === item.id}
              compact={collapsed}
              onPress={() => navigate(item.id)}
            />
          ))}
          <NavigationItem
            label="Ordinateur de l’assistant"
            icon={Monitor}
            compact={collapsed}
            onPress={onOpenComputer}
          />
        </ScrollView>
        <View
          style={{
            paddingHorizontal: collapsed ? 12 : 14,
            paddingTop: 12,
            paddingBottom: 14,
            gap: 12,
            alignItems: collapsed ? "center" : undefined,
            borderTopWidth: 1,
            borderTopColor: colors.line,
          }}
        >
          {collapsed ? (
            <View>
              <IconButton
                icon={Bell}
                label={
                  pending
                    ? `Ouvrir les notifications, ${pending} élément${pending > 1 ? "s" : ""} à consulter`
                    : "Ouvrir les notifications"
                }
                onPress={onOpenNotifications}
              />
              {!!pending && (
                <View
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 9,
                    height: 9,
                    borderRadius: 5,
                    backgroundColor: colors.danger,
                    borderWidth: 1,
                    borderColor: colors.card,
                  }}
                />
              )}
            </View>
          ) : (
            <>
              <NotificationShortcut pending={pending} onPress={onOpenNotifications} />
              <View style={[s.row, { gap: 10, paddingHorizontal: 2 }]}>
                <View
                  accessible={false}
                  style={{
                    width: 36,
                    height: 36,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 12,
                    backgroundColor: colors.accent,
                  }}
                >
                  <PanelsTopLeft size={17} color={colors.accentDark} />
                </View>
                <View style={{ flex: 1, minWidth: 0, gap: 1 }}>
                  <Text
                    style={{
                      color: colors.muted,
                      fontSize: 9,
                      lineHeight: 13,
                      fontWeight: "700",
                      letterSpacing: 0.9,
                    }}
                  >
                    ESPACE ACTUEL
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[s.small, { color: colors.text, fontWeight: "600" }]}
                  >
                    {workspaceName}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

export function MobileTopBar({
  agentName,
  status,
  avatar,
  appearance,
  pending,
  onOpenMenu,
  onOpenNotifications,
}: {
  agentName: string;
  status: string;
  avatar?: "sky" | "sand" | "lilac";
  appearance?: Parameters<typeof Mascot>[0]["appearance"];
  pending: number;
  onOpenMenu: () => void;
  onOpenNotifications: () => void;
}) {
  return (
    <View
      role="banner"
      style={{
        minHeight: 72,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.line,
      }}
    >
      <IconButton
        nativeID="alineo-mobile-menu-trigger"
        icon={Menu}
        label="Ouvrir la navigation"
        hint="Choisissez une section, ouvrez vos conversations ou accédez aux outils de l’espace."
        onPress={onOpenMenu}
      />
      <View
        style={{
          flex: 1,
          minWidth: 0,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Mascot size={36} variant={avatar} appearance={appearance} />
        <View style={{ flexShrink: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={[s.text, { fontWeight: "700", lineHeight: 19 }]}>
            {agentName}
          </Text>
          <Text numberOfLines={1} style={[s.small, { fontSize: 12 }]}>
            {status}
          </Text>
        </View>
      </View>
      <View>
        <IconButton
          icon={Bell}
          label={`Notifications, ${pending} élément${pending > 1 ? "s" : ""} à lire ou à valider`}
          hint="Consultez les résultats, changements et demandes qui nécessitent votre attention."
          onPress={onOpenNotifications}
        />
        {!!pending && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 7,
              right: 9,
              width: 8,
              height: 8,
              borderRadius: 5,
              backgroundColor: colors.danger,
              borderWidth: 1,
              borderColor: colors.card,
            }}
          />
        )}
      </View>
    </View>
  );
}

export function MobileBottomNavigation({
  section,
  navigate,
  onOpenMenu,
}: {
  section: Section;
  navigate: (section: Section) => void;
  onOpenMenu: () => void;
}) {
  return (
    <View
      accessibilityRole={Platform.OS === "web" ? undefined : "tabbar"}
      role={Platform.OS === "web" ? "navigation" : undefined}
      accessibilityLabel="Sections principales"
      style={{
        paddingHorizontal: 14,
        paddingTop: 8,
        paddingBottom: 8,
        alignItems: "center",
        backgroundColor: colors.canvas,
        borderTopWidth: 1,
        borderTopColor: colors.line,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          maxWidth: 560,
          padding: 4,
          gap: 3,
          backgroundColor: colors.card,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: colors.line,
        }}
      >
        {primarySections
          .filter((item) => item.id !== "apps")
          .map((item) => (
            <NavigationItem
              key={item.id}
              variant="bottom"
              label={item.label}
              icon={item.icon}
              active={section === item.id}
              onPress={() => navigate(item.id)}
            />
          ))}
        <NavigationItem
          variant="bottom"
          nativeID="alineo-mobile-more-trigger"
          label="Plus"
          icon={MoreHorizontal}
          action
          onPress={onOpenMenu}
        />
      </View>
    </View>
  );
}

export function MobileNavigationDrawer({
  visible,
  section,
  agentName,
  status,
  avatar,
  appearance,
  workspaceName,
  pending,
  returnFocusId = "alineo-mobile-menu-trigger",
  navigate,
  onClose,
  onOpenThreads,
  onOpenNotifications,
  onOpenComputer,
}: {
  visible: boolean;
  section: Section;
  agentName: string;
  status: string;
  avatar?: "sky" | "sand" | "lilac";
  appearance?: Parameters<typeof Mascot>[0]["appearance"];
  workspaceName: string;
  pending: number;
  returnFocusId?: string;
  navigate: (section: Section) => void;
  onClose: () => void;
  onOpenThreads: () => void;
  onOpenNotifications: () => void;
  onOpenComputer: () => void;
}) {
  const { width } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const drawerWidth = Math.min(360, Math.max(280, width * 0.88));

  useEffect(() => {
    if (!visible || Platform.OS !== "web" || typeof document === "undefined") return;
    const dialog = document.getElementById("alineo-mobile-navigation-dialog");
    if (!dialog) return;

    const focusClose = window.requestAnimationFrame(() => {
      document.getElementById("alineo-mobile-menu-close")?.focus();
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
        ),
      ).filter(
        (item) =>
          item.getAttribute("aria-hidden") !== "true" &&
          item.getAttribute("aria-disabled") !== "true",
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
        return;
      }
      const outsideDialog = !dialog.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || outsideDialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || outsideDialog)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(focusClose);
      document.removeEventListener("keydown", onKeyDown);
      window.requestAnimationFrame(() => {
        const anotherDialogIsOpen = Array.from(
          document.querySelectorAll<HTMLElement>('[role="dialog"]'),
        ).some((item) => item.id !== "alineo-mobile-navigation-dialog");
        if (!anotherDialogIsOpen) {
          document.getElementById(returnFocusId)?.focus();
        }
      });
    };
  }, [returnFocusId, visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType={reducedMotion ? "none" : "slide"}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, flexDirection: "row", backgroundColor: "rgba(0,0,0,0.72)" }}>
        <View style={{ width: drawerWidth, maxWidth: "88%", backgroundColor: colors.card }}>
          <SafeAreaView
            nativeID="alineo-mobile-navigation-dialog"
            role="dialog"
            aria-modal={true}
            accessibilityViewIsModal
            onAccessibilityEscape={onClose}
            accessibilityLabel="Menu de navigation de l’espace de travail"
            style={{ flex: 1 }}
            edges={["top", "bottom", "left"]}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 18,
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: colors.line,
              }}
            >
              <BrandLogo size={36} />
              <IconButton
                nativeID="alineo-mobile-menu-close"
                icon={X}
                label="Fermer le menu de navigation"
                onPress={onClose}
              />
            </View>
            <View style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
              <AssistantIdentityCard
                agentName={agentName}
                status={status}
                avatar={avatar}
                appearance={appearance}
              />
            </View>
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20, gap: 5 }}
            >
              <GroupLabel>Votre espace</GroupLabel>
              {primarySections.map((item) => (
                <NavigationItem
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  active={section === item.id}
                  onPress={() => navigate(item.id)}
                />
              ))}
              <NavigationItem label="Conversations" icon={MessageCircle} onPress={onOpenThreads} />
              <View style={[s.divider, { marginVertical: 12 }]} />
              <GroupLabel>Vos outils</GroupLabel>
              {workspaceSections.map((item) => (
                <NavigationItem
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  active={section === item.id}
                  onPress={() => navigate(item.id)}
                />
              ))}
              <NavigationItem
                label="Ordinateur de l’assistant"
                icon={Monitor}
                onPress={onOpenComputer}
              />
              <NavigationItem
                label="Notifications"
                icon={Bell}
                count={pending}
                onPress={onOpenNotifications}
              />
            </ScrollView>
            <View
              style={{
                paddingHorizontal: 18,
                paddingVertical: 12,
                borderTopWidth: 1,
                borderTopColor: colors.line,
              }}
            >
              <Text numberOfLines={1} style={s.small}>
                {workspaceName}
              </Text>
            </View>
          </SafeAreaView>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fermer le menu de navigation"
          onPress={onClose}
          style={{ flex: 1 }}
        />
      </View>
    </Modal>
  );
}
