import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import {
  ArrowDownToLine,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Globe2,
  Inbox,
  Link2,
  type LucideIcon,
  Mail,
  Plus,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import type {
  Artifact,
  BrowserSession,
  CalendarEvent,
  EmailDraft,
} from "../../../packages/domain/src";
import { useAgentWorkspace } from "./agent-workspace";
import { API_URL, sessionHeaders } from "./api";
import { BrandIcon, type BrandIconName } from "./brand-icon";
import { browserAddress } from "./browser-address";
import { localDateTime, startOfZonedDay, zonedInstant } from "./date-time";
import { frenchCount, frenchStatusLabel } from "./locale";
import {
  Button,
  Card,
  Chip,
  colors,
  dateLabel,
  Empty,
  ErrorNotice,
  Field,
  Heading,
  IconButton,
  LinkRow,
  LoadingNotice,
  Mascot,
  relativeDate,
  resultSummary,
  SectionHeading,
  Sheet,
  s,
  timeLabel,
} from "./ui";
import { useWorkspace } from "./workspace";

function todayDate() {
  return localDateTime(new Date().toISOString(), Intl.DateTimeFormat().resolvedOptions().timeZone)
    .date;
}
function eventDate(event: CalendarEvent) {
  return event.allDay ? event.start : localDateTime(event.start, event.timeZone).date;
}
export function TodayScreen() {
  const { workspace: w, navigate, open, ask } = useWorkspace();
  const { data: agent } = useAgentWorkspace();
  const wide = useWindowDimensions().width > 1180;
  const pending = w.actions.filter((a) => a.status === "awaiting_review");
  const unread = w.mail.filter((m) => m.unread);
  const today = todayDate();
  const events = w.events
    .filter((e) => eventDate(e) === today)
    .sort((a, b) => a.start.localeCompare(b.start));
  return (
    <View style={{ gap: 25 }}>
      <View
        style={[
          {
            backgroundColor: colors.sky,
            borderRadius: 24,
            padding: 32,
            minHeight: 228,
            overflow: "hidden",
          },
          s.row,
        ]}
      >
        <View style={{ flex: 1, gap: 15, zIndex: 1 }}>
          <View style={[s.row, { gap: 7 }]}>
            <Sparkles size={13} color={colors.accentDark} />
            <Text style={[s.label, { color: colors.accentDark }]}>
              Un peu de clarté, chaque jour
            </Text>
          </View>
          <Text
            style={{
              fontSize: wide ? 39 : 29,
              lineHeight: wide ? 45 : 36,
              letterSpacing: -1.7,
              fontWeight: "500",
              color: colors.text,
            }}
          >
            Votre journée, avec plus d’espace{"\n"}pour respirer.
          </Text>
          <Text style={[s.muted, { maxWidth: 420, color: colors.muted }]}>
            {events.length
              ? `${events.length} événement${events.length > 1 ? "s" : ""} dans votre calendrier`
              : "Votre calendrier est dégagé"}
            {unread.length
              ? `, ${unread.length} courriel${unread.length > 1 ? "s" : ""} non lu${unread.length > 1 ? "s" : ""}`
              : ""}
            .{"\n"}Faisons de la place à l’essentiel.
          </Text>
          <Button
            onPress={() => ask("Aide-moi à organiser ma journée")}
            icon={Sparkles}
            primary
            style={{ alignSelf: "flex-start", marginTop: 5 }}
          >
            Organiser ma journée
          </Button>
        </View>
        {wide && (
          <View style={{ width: 220, height: 210, alignItems: "center", justifyContent: "center" }}>
            <View
              style={{
                position: "absolute",
                width: 190,
                height: 190,
                borderRadius: 100,
                backgroundColor: colors.accent,
              }}
            />
            <View
              style={{
                position: "absolute",
                width: 145,
                height: 145,
                borderRadius: 80,
                borderWidth: 1,
                borderColor: colors.line,
              }}
            />
            <Mascot
              size={94}
              variant={agent?.identity.avatar}
              appearance={agent?.identity.micOrb}
            />
            <View
              style={[
                s.row,
                {
                  position: "absolute",
                  top: 17,
                  left: -19,
                  padding: 11,
                  gap: 7,
                  backgroundColor: colors.card,
                  borderRadius: 13,
                  transform: [{ rotate: "-7deg" }],
                },
              ]}
            >
              <Check size={14} color={colors.accentDark} />
              <Text style={s.small}>Une journée plus légère</Text>
            </View>
            <View
              style={[
                s.row,
                {
                  position: "absolute",
                  bottom: 18,
                  right: -8,
                  padding: 12,
                  gap: 8,
                  backgroundColor: colors.card,
                  borderRadius: 13,
                  transform: [{ rotate: "5deg" }],
                },
              ]}
            >
              <CalendarDays size={17} color={colors.accentDark} />
              <Text style={s.small}>Tout au même endroit</Text>
            </View>
          </View>
        )}
      </View>
      <View style={{ flexDirection: "row", gap: 13, flexWrap: "wrap" }}>
        {[
          {
            label: "COURRIELS NON LUS",
            value: unread.length,
            note: "Un œil sur votre boîte de réception",
            icon: Mail,
            section: "mail" as const,
            tint: colors.sky,
          },
          {
            label: "AUJOURD’HUI",
            value: events.length,
            note: "Faites de la place à vos priorités",
            icon: CalendarDays,
            section: "calendar" as const,
            tint: colors.green,
          },
          {
            label: "À VALIDER",
            value: pending.length,
            note: "Votre validation fait avancer les choses",
            icon: ShieldCheck,
            section: "activity" as const,
            tint: colors.lavender,
          },
        ].map((item) => (
          <Pressable
            key={item.label}
            accessibilityRole="button"
            accessibilityLabel={`Ouvrir ${item.label.toLowerCase()} : ${item.note}`}
            onPress={() => navigate(item.section)}
            style={{ flex: 1, minWidth: 180 }}
          >
            <Card style={{ padding: 21, height: 126 }}>
              <View style={s.between}>
                <Text style={[s.label, { fontSize: 12, letterSpacing: 0.6 }]}>{item.label}</Text>
                <View
                  style={[
                    s.iconBox,
                    { width: 31, height: 31, borderRadius: 10, backgroundColor: item.tint },
                  ]}
                >
                  <item.icon size={15} color={colors.text} />
                </View>
              </View>
              <Text style={{ fontSize: 29, color: colors.text, letterSpacing: -1, marginTop: -2 }}>
                {String(item.value).padStart(2, "0")}
              </Text>
              <Text style={[s.small, { marginTop: 3 }]}>{item.note}</Text>
            </Card>
          </Pressable>
        ))}
      </View>
      <View style={{ flexDirection: wide ? "row" : "column", gap: 22 }}>
        <Card style={{ flex: 1 }}>
          <SectionHeading
            title="Dans votre calendrier"
            action="Tout le calendrier"
            onPress={() => navigate("calendar")}
          />
          {events.length ? (
            events.slice(0, 3).map((e, i) => <AgendaRow key={e.id} event={e} index={i} />)
          ) : (
            <Empty
              icon={CalendarDays}
              title="Un peu d’espace"
              detail="Aucun événement prévu aujourd’hui."
            />
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Créer un événement dans le calendrier"
            accessibilityHint="Ouvrir le formulaire de création d’événement."
            onPress={() => open({ type: "event" })}
            style={[
              s.row,
              {
                gap: 8,
                minHeight: 44,
                paddingTop: 15,
                marginTop: 9,
                borderTopWidth: 1,
                borderTopColor: colors.line,
              },
            ]}
          >
            <Plus size={15} color={colors.muted} />
            <Text style={s.small}>Prévoir un moment</Text>
          </Pressable>
        </Card>
        <Card style={{ flex: 1 }}>
          <SectionHeading
            title="Dans votre boîte de réception"
            action="Ouvrir le courrier"
            onPress={() => navigate("mail")}
          />
          {w.mail.length ? (
            w.mail.slice(0, 3).map((m, i) => (
              <Pressable
                key={m.id}
                accessibilityRole="button"
                accessibilityLabel={`Ouvrir le message de ${m.sender} : ${m.subject}${m.unread ? ", non lu" : ""}`}
                onPress={() => open({ type: "mail", mail: m })}
                style={[
                  s.row,
                  {
                    gap: 12,
                    paddingVertical: 13,
                    borderTopWidth: i ? 1 : 0,
                    borderTopColor: colors.line,
                  },
                ]}
              >
                <Avatar name={m.sender} index={i} />
                <View style={{ flex: 1, gap: 3 }}>
                  <View style={s.between}>
                    <Text style={[s.text, { fontSize: 12, fontWeight: "600" }]}>{m.sender}</Text>
                    <Text style={s.small}>{timeLabel(m.date)}</Text>
                  </View>
                  <Text numberOfLines={1} style={[s.text, { fontSize: 12, lineHeight: 18 }]}>
                    {m.subject}
                  </Text>
                  <Text numberOfLines={1} style={s.small}>
                    {m.body.replace(/\n/g, " ")}
                  </Text>
                </View>
                {m.unread && (
                  <View
                    style={{ width: 5, height: 5, borderRadius: 4, backgroundColor: colors.focus }}
                  />
                )}
              </Pressable>
            ))
          ) : (
            <Empty
              icon={Inbox}
              title="Votre boîte est calme"
              detail="Connectez Google dans Applications pour afficher vos messages ici."
            />
          )}
        </Card>
      </View>
      <View style={{ flexDirection: wide ? "row" : "column", gap: 22 }}>
        <Card style={{ flex: 1, backgroundColor: colors.orange }}>
          <SectionHeading title="Un coup de main pour les petites choses" />
          <Text style={[s.muted, { marginBottom: 15 }]}>
            Dites-moi ce que vous avez en tête. Je m’occupe du reste.
          </Text>
          {[
            "Qu’est-ce qui mérite mon attention aujourd’hui ?",
            "Aide-moi à faire le tri dans mes courriels",
            "Montre-moi mes documents récents",
          ].map((prompt) => (
            <Pressable
              key={prompt}
              accessibilityRole="button"
              accessibilityLabel={`Demander à Alineo : ${prompt}`}
              accessibilityHint="Ouvrir cette suggestion dans le chat."
              onPress={() => ask(prompt)}
              style={[
                s.between,
                { borderTopWidth: 1, borderTopColor: colors.line, paddingVertical: 13 },
              ]}
            >
              <Text style={[s.text, { fontSize: 12 }]}>{prompt}</Text>
              <ArrowUpRight size={15} color={colors.muted} />
            </Pressable>
          ))}
        </Card>
        <Card style={{ flex: 1 }}>
          <SectionHeading
            title={pending.length ? "À valider" : "Activité récente"}
            action="Tout afficher"
            onPress={() => navigate("activity")}
          />
          {pending.length
            ? pending
                .slice(0, 3)
                .map((a) => (
                  <LinkRow
                    key={a.id}
                    title={a.title}
                    detail="Préparée · en attente de votre validation"
                    onPress={() => open({ type: "review", action: a })}
                    icon={ShieldCheck}
                    tint={colors.lavender}
                  />
                ))
            : w.activity.slice(0, 3).map((a) => (
                <View key={a.id} style={[s.row, { gap: 13, paddingVertical: 12 }]}>
                  <View
                    style={[s.iconBox, { width: 32, height: 32, backgroundColor: colors.green }]}
                  >
                    <Check size={14} color={colors.text} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.text, { fontSize: 12 }]}>{a.title}</Text>
                    <Text style={s.small}>{relativeDate(a.date)}</Text>
                  </View>
                </View>
              ))}
          {!pending.length && !w.activity.length && (
            <Text style={s.muted}>
              Votre espace est prêt. Les actions et leurs résultats apparaîtront dans votre
              activité.
            </Text>
          )}
        </Card>
      </View>
    </View>
  );
}
function Avatar({ name, index = 0 }: { name: string; index?: number }) {
  return (
    <View
      style={{
        width: 35,
        height: 35,
        borderRadius: 12,
        backgroundColor: [colors.orange, colors.lavender, colors.green, colors.sky][index % 4],
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: colors.text, fontSize: 12, fontWeight: "500" }}>
        {name
          .split(" ")
          .map((p) => p[0])
          .slice(0, 2)
          .join("")}
      </Text>
    </View>
  );
}
export function AgendaRow({
  event: e,
  index = 0,
  neighbors,
}: {
  event: CalendarEvent;
  index?: number;
  neighbors?: CalendarEvent[];
}) {
  const { open } = useWorkspace();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ouvrir l’événement : ${e.title}, ${e.allDay ? "toute la journée" : timeLabel(e.start, e.timeZone)}${e.location ? `, ${e.location}` : ""}`}
      onPress={() => open({ type: "event", event: e, neighbors })}
      style={[s.row, { gap: 16, paddingVertical: 14, minHeight: 64 }]}
    >
      <View style={{ width: 65 }}>
        <Text style={s.text}>{e.allDay ? "Toute la journée" : timeLabel(e.start, e.timeZone)}</Text>
        {!e.allDay && <Text style={s.small}>{timeLabel(e.end, e.timeZone)}</Text>}
      </View>
      <View
        style={{
          width: 3,
          height: 42,
          borderRadius: 4,
          backgroundColor: [colors.accent, colors.green, colors.lavender][index % 3],
        }}
      />
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={[s.text, { fontSize: 13, fontWeight: "500" }]}>{e.title}</Text>
        <Text numberOfLines={1} style={s.small}>
          {e.location ||
            (e.attendees.length
              ? `${e.attendees.length} participant${e.attendees.length > 1 ? "s" : ""}`
              : "Un moment pour vous")}
        </Text>
      </View>
      <ChevronRight size={14} color={colors.muted} />
    </Pressable>
  );
}
export function MailScreen() {
  const { workspace: w, api, open, navigate } = useWorkspace();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [drafts, setDrafts] = useState<(EmailDraft & { id: string; createdAt: string })[]>([]);
  const [error, setError] = useState("");
  const [draftsLoading, setDraftsLoading] = useState(true);
  const [draftsAttempt, setDraftsAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setError("");
    setDraftsLoading(true);
    void api
      .request<(EmailDraft & { id: string; createdAt: string })[]>("/api/drafts")
      .then((next) => {
        if (active) setDrafts(next);
      })
      .catch((e) => {
        if (active) setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (active) setDraftsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [api, w, draftsAttempt]);
  const items = w.mail.filter(
    (m) =>
      (tab !== "unread" || m.unread) &&
      `${m.sender} ${m.subject} ${m.body}`.toLowerCase().includes(query.toLowerCase()),
  );
  const filteredDrafts = drafts.filter((d) =>
    `${d.to.join(" ")} ${d.subject} ${d.body}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <View style={{ gap: 20 }}>
      <View style={[s.between, { gap: 12, flexWrap: "wrap", alignItems: "flex-end" }]}>
        <View style={{ flex: 1, minWidth: 200 }}>
          <Field
            label="Rechercher dans le courrier"
            value={query}
            onChangeText={setQuery}
            placeholder="Expéditeur, objet ou message"
            containerStyle={{ marginBottom: 0 }}
          />
        </View>
        <Button onPress={() => open({ type: "email" })} primary icon={Plus}>
          Rédiger
        </Button>
      </View>
      {tab === "drafts" && <ErrorNotice error={error} />}
      {tab === "drafts" && error && (
        <Button small onPress={() => setDraftsAttempt((attempt) => attempt + 1)}>
          Réessayer de charger les brouillons
        </Button>
      )}
      <Card>
        <View style={[s.row, { gap: 10, marginBottom: 15, flexWrap: "wrap" }]}>
          <Button
            small
            primary={tab === "all"}
            selected={tab === "all"}
            onPress={() => setTab("all")}
          >
            Tous les messages
          </Button>
          <Button
            small
            primary={tab === "unread"}
            selected={tab === "unread"}
            onPress={() => setTab("unread")}
          >
            Non lus · {w.mail.filter((m) => m.unread).length}
          </Button>
          <Button
            small
            primary={tab === "drafts"}
            selected={tab === "drafts"}
            onPress={() => setTab("drafts")}
          >
            Brouillons · {drafts.length}
          </Button>
        </View>
        {tab === "drafts" ? (
          draftsLoading ? (
            <LoadingNotice label="Chargement des brouillons enregistrés…" centered />
          ) : filteredDrafts.length ? (
            filteredDrafts.map((d) => (
              <LinkRow
                key={d.id}
                icon={Mail}
                title={d.subject || "Sans objet"}
                detail={`À : ${d.to.join(", ") || "Aucun destinataire"} · enregistré le ${dateLabel(d.createdAt)}`}
                onPress={() => open({ type: "email", draft: d })}
              />
            ))
          ) : (
            <Empty
              icon={Mail}
              title={query ? "Aucun brouillon correspondant" : "Aucun brouillon enregistré"}
              detail={
                query
                  ? "Essayez une autre adresse ou un autre objet."
                  : "Enregistrez un message pour le terminer plus tard."
              }
            >
              {query ? (
                <Button small onPress={() => setQuery("")}>
                  Effacer la recherche
                </Button>
              ) : null}
            </Empty>
          )
        ) : items.length ? (
          items.map((m, i) => (
            <Pressable
              key={m.id}
              accessibilityRole="button"
              accessibilityLabel={`${m.unread ? "Message non lu" : "Message"} de ${m.sender} : ${m.subject}`}
              onPress={() => open({ type: "mail", mail: m })}
              style={[
                s.row,
                {
                  gap: 15,
                  minHeight: 68,
                  paddingVertical: 16,
                  borderTopWidth: 1,
                  borderTopColor: colors.line,
                },
              ]}
            >
              <Avatar name={m.sender} index={i} />
              <View style={{ flex: 1, gap: 5 }}>
                <View style={s.between}>
                  <Text style={[s.text, { fontWeight: m.unread ? "600" : "400" }]}>{m.sender}</Text>
                  <Text style={s.small}>{dateLabel(m.date)}</Text>
                </View>
                <Text style={[s.text, { fontWeight: "500", fontSize: 13 }]}>{m.subject}</Text>
                <Text style={s.muted} numberOfLines={1}>
                  {m.body.replace(/\n/g, " ")}
                </Text>
                {!!m.attachments.length && (
                  <View style={[s.row, { gap: 4, marginTop: 2 }]}>
                    <FileText size={12} color={colors.muted} />
                    <Text style={s.small}>
                      {frenchCount(m.attachments.length, "pièce jointe", "pièces jointes")}
                    </Text>
                  </View>
                )}
              </View>
              {m.unread && (
                <View
                  style={{ width: 6, height: 6, borderRadius: 4, backgroundColor: colors.focus }}
                />
              )}
            </Pressable>
          ))
        ) : (
          <Empty
            icon={Inbox}
            title={
              query
                ? "Aucun message correspondant"
                : tab === "unread"
                  ? "Vous êtes à jour"
                  : "Aucun message pour le moment"
            }
            detail={
              query
                ? "Essayez un autre expéditeur ou un autre objet."
                : tab === "unread"
                  ? "Aucun message non lu dans cet espace."
                  : "Connectez Google dans Applications pour consulter votre courrier ici."
            }
          >
            {query ? (
              <Button small onPress={() => setQuery("")}>
                Effacer la recherche
              </Button>
            ) : tab === "unread" ? (
              <Button small onPress={() => setTab("all")}>
                Afficher tous les messages
              </Button>
            ) : (
              <Button small onPress={() => navigate("apps")}>
                Gérer les connexions
              </Button>
            )}
          </Empty>
        )}
      </Card>
    </View>
  );
}
interface CalendarChoice {
  id: string;
  name: string;
  timeZone: string;
  accessRole: string;
}
function plusDays(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
export function CalendarScreen() {
  const { workspace: w, api, open } = useWorkspace();
  const [date, setDate] = useState(todayDate());
  const [all, setAll] = useState(false);
  const [calendars, setCalendars] = useState<CalendarChoice[]>([]);
  const [calendarId, setCalendarId] = useState("primary");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [calendarListLoading, setCalendarListLoading] = useState(true);
  const [calendarListError, setCalendarListError] = useState("");
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const selected = calendars.find((c) => c.id === calendarId);
  const zone = selected?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const writable =
    !calendarListLoading &&
    !calendarListError &&
    (!selected || ["owner", "writer"].includes(selected.accessRole));
  const anchor = new Date(`${date}T12:00:00`);
  const dates = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(anchor);
    day.setDate(anchor.getDate() - anchor.getDay() + i);
    return day;
  });
  useEffect(() => {
    let active = true;
    setCalendarListLoading(true);
    setCalendarListError("");
    void api
      .request<CalendarChoice[]>("/api/calendars")
      .then((items) => {
        if (!active) return;
        setCalendars(items);
        setCalendarId((current) =>
          items.some((c) => c.id === current) ? current : items[0]?.id || "primary",
        );
      })
      .catch((e) => {
        if (active) setCalendarListError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (active) setCalendarListLoading(false);
      });
    return () => {
      active = false;
    };
  }, [api, retry]);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    void Promise.resolve()
      .then(() => {
        const query = new URLSearchParams({
          calendarId,
          timeMin: startOfZonedDay(date, zone),
          timeMax: startOfZonedDay(plusDays(date, all ? 30 : 1), zone),
        });
        return api.request<CalendarEvent[]>(`/api/calendar/events?${query}`);
      })
      .then((items) => {
        if (active) setEvents(items.sort((a, b) => a.start.localeCompare(b.start)));
      })
      .catch((e) => {
        if (active) {
          setEvents([]);
          setError(e instanceof Error ? e.message : String(e));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [api, calendarId, date, all, zone, w, retry]);
  function newEvent() {
    open({
      type: "event",
      neighbors: events,
      draft: {
        calendarId,
        title: "",
        start: zonedInstant(date, "09:00", zone),
        end: zonedInstant(date, "10:00", zone),
        allDay: false,
        timeZone: zone,
        location: "",
        description: "",
        attendees: [],
      },
    });
  }
  return (
    <View style={{ gap: 20 }}>
      <View style={[s.between, { gap: 12, flexWrap: "wrap" }]}>
        <View style={[s.row, { gap: 8, flexWrap: "wrap" }]}>
          <Heading level={2} style={s.title}>
            {anchor.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
          </Heading>
          <IconButton
            icon={ChevronLeft}
            label="Semaine précédente"
            hint="Afficher les sept jours précédents."
            onPress={() => setDate(plusDays(date, -7))}
          />
          <IconButton
            icon={ChevronRight}
            label="Semaine suivante"
            hint="Afficher les sept jours suivants."
            onPress={() => setDate(plusDays(date, 7))}
          />
        </View>
        <Button
          primary
          icon={Plus}
          disabled={!writable}
          hint={
            !writable
              ? "Choisissez un calendrier sur lequel vous pouvez créer un événement."
              : undefined
          }
          onPress={newEvent}
        >
          Nouvel événement
        </Button>
      </View>
      {calendarListLoading && <LoadingNotice label="Chargement de vos calendriers…" />}
      {!!calendarListError && (
        <>
          <ErrorNotice error={calendarListError} />
          <Button small onPress={() => setRetry((attempt) => attempt + 1)}>
            Réessayer de charger les calendriers
          </Button>
        </>
      )}
      {selected && !writable && (
        <Text style={s.small}>
          Ce calendrier est en lecture seule. Choisissez-en un autre pour effectuer des
          modifications.
        </Text>
      )}
      {calendars.length > 0 && (
        <View style={{ gap: 9 }}>
          <Text style={s.label}>Vos calendriers</Text>
          <View style={[s.row, { gap: 8, flexWrap: "wrap" }]}>
            {calendars.map((c) => (
              <Button
                key={c.id}
                small
                primary={c.id === calendarId}
                selected={c.id === calendarId}
                onPress={() => setCalendarId(c.id)}
              >
                {c.name}
                {["owner", "writer"].includes(c.accessRole) ? "" : " · lecture seule"}
              </Button>
            ))}
          </View>
        </View>
      )}
      <Card style={{ padding: 12 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row", gap: 5 }}>
            {dates.map((day) => {
              const key = localDateTime(
                day.toISOString(),
                Intl.DateTimeFormat().resolvedOptions().timeZone,
              ).date;
              const selectedDate = key === date;
              const hasEvents = [...events, ...w.events].some(
                (event) => event.calendarId === calendarId && eventDate(event) === key,
              );
              const readableDate = day.toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              return (
                <Pressable
                  key={key}
                  accessibilityRole="button"
                  accessibilityLabel={`${readableDate}. ${hasEvents ? "Événements prévus." : "Aucun événement affiché."}`}
                  accessibilityHint="Afficher les événements de cette journée."
                  accessibilityState={{ selected: selectedDate }}
                  onPress={() => {
                    setDate(key);
                    setAll(false);
                  }}
                  style={({ pressed }) => ({
                    width: 48,
                    minHeight: 76,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 8,
                    gap: 6,
                    borderRadius: 14,
                    backgroundColor: selectedDate
                      ? colors.sky
                      : pressed
                        ? colors.canvas
                        : "transparent",
                  })}
                >
                  <Text style={s.small}>
                    {day.toLocaleDateString("fr-FR", { weekday: "short" })}
                  </Text>
                  <Text
                    style={[
                      s.title,
                      { fontSize: 22, color: selectedDate ? colors.accentDark : colors.text },
                    ]}
                  >
                    {day.getDate()}
                  </Text>
                  <View
                    accessible={false}
                    style={{
                      height: 5,
                      width: 5,
                      borderRadius: 4,
                      backgroundColor: hasEvents ? colors.accentDark : "transparent",
                    }}
                  />
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </Card>
      <Card>
        <View style={[s.between, { gap: 10, flexWrap: "wrap" }]}>
          <Heading level={2} style={s.heading}>
            {all
              ? "Les 30 prochains jours"
              : dateLabel(`${date}T12:00:00`, { weekday: "long", month: "long", day: "numeric" })}
          </Heading>
          <Button small selected={all} onPress={() => setAll(!all)}>
            {all ? "Journée sélectionnée" : "30 prochains jours"}
          </Button>
        </View>
        <Text style={[s.small, { marginTop: 7, marginBottom: 13 }]}>
          {selected?.name || "Votre calendrier"} · {zone}. Chaque événement utilise son propre
          fuseau horaire.
        </Text>
        <ErrorNotice error={error} />
        {!!error && (
          <Button small onPress={() => setRetry(retry + 1)}>
            Réessayer
          </Button>
        )}
        {loading ? (
          <LoadingNotice label="Vérification de votre calendrier…" centered />
        ) : events.length ? (
          events.map((e, i) => (
            <View key={e.id}>
              {all && <Text style={[s.label, { marginTop: 16 }]}>{dateLabel(e.start)}</Text>}
              <AgendaRow event={e} index={i} neighbors={events} />
              <Text style={[s.small, { marginLeft: 84, marginBottom: 8 }]}>{e.timeZone}</Text>
            </View>
          ))
        ) : (
          !error && (
            <Empty
              icon={CalendarDays}
              title="Un peu de temps libre"
              detail={
                all
                  ? "Aucun événement prévu pour les 30 prochains jours."
                  : "Aucun événement prévu à cette date."
              }
            >
              {writable && (
                <Button icon={Plus} onPress={newEvent}>
                  Ajouter un événement
                </Button>
              )}
            </Empty>
          )
        )}
      </Card>
    </View>
  );
}
export function BrowserScreen() {
  const { workspace: w, api, refresh, open } = useWorkspace();
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function create() {
    setError("");
    setBusy(true);
    try {
      const browser = await api.request<BrowserSession>("/api/browsers", {
        url: browserAddress(url),
      });
      await refresh();
      setUrl("");
      open({ type: "browser", browser });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <View style={{ gap: 22 }}>
      <Card style={{ backgroundColor: colors.sky }}>
        <View style={[s.row, { gap: 12, marginBottom: 15 }]}>
          <Globe2 size={22} color={colors.accentDark} />
          <View>
            <Text style={s.heading}>Vos onglets, au même endroit</Text>
            <Text style={s.muted}>
              Naviguez dans une session privée et persistante de votre espace.
            </Text>
          </View>
        </View>
        <View style={[s.row, { gap: 10, alignItems: "flex-end", flexWrap: "wrap" }]}>
          <View style={{ flex: 1, minWidth: 190 }}>
            <Field
              label="Adresse du site web"
              value={url}
              onChangeText={setUrl}
              onSubmitEditing={() => void create()}
              autoCapitalize="none"
              keyboardType="url"
              placeholder="https://example.com"
              hint="Saisissez une adresse publique commençant par http ou https."
              containerStyle={{ marginBottom: 0 }}
            />
          </View>
          <Button
            primary
            icon={Plus}
            busy={busy}
            disabled={!url.trim()}
            hint={
              !url.trim() ? "Saisissez l’adresse d’un site pour ouvrir une session." : undefined
            }
            onPress={() => void create()}
          >
            Ouvrir une session
          </Button>
        </View>
        <ErrorNotice error={error} />
      </Card>
      <Card>
        <SectionHeading title="Sessions de navigation" />
        {w.browsers.length ? (
          w.browsers.map((b) => (
            <Pressable
              key={b.id}
              accessibilityRole="button"
              accessibilityLabel={`Ouvrir ${b.title || "la session de navigation"}, ${frenchStatusLabel(b.status)}, ${b.url}`}
              onPress={() => open({ type: "browser", browser: b })}
              style={{
                minHeight: 64,
                borderTopWidth: 1,
                borderTopColor: colors.line,
                paddingVertical: 16,
                gap: 12,
              }}
            >
              <View style={[s.row, { gap: 14 }]}>
                <View style={s.iconBox}>
                  <Globe2 size={20} color={colors.accentDark} />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={s.heading}>{b.title || "Session de navigation"}</Text>
                  <Text style={s.muted} numberOfLines={1}>
                    {b.url}
                  </Text>
                </View>
                <Chip tint={b.status === "active" ? colors.green : colors.canvas}>
                  {frenchStatusLabel(b.status)}
                </Chip>
                <ArrowUpRight size={17} color={colors.muted} />
              </View>
              {!!b.previewUrl && (
                <Image
                  source={{ uri: api.url(b.previewUrl) }}
                  resizeMode="cover"
                  style={{
                    height: 180,
                    width: "100%",
                    borderRadius: 12,
                    backgroundColor: colors.canvas,
                  }}
                />
              )}
            </Pressable>
          ))
        ) : (
          <Empty
            icon={Globe2}
            title="Commencez par un site web"
            detail="Ouvrez une session ci-dessus pour retrouver vos pages au même endroit. Les aperçus en direct apparaîtront lorsque le navigateur sera configuré."
          />
        )}
      </Card>
    </View>
  );
}
export function FilesScreen() {
  const { workspace: w, api, refresh, open } = useWorkspace();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function upload() {
    setError("");
    setBusy(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const file = result.assets[0];
      let artifact: Artifact;
      if (Platform.OS === "web") {
        const form = new FormData();
        if (!file.file)
          throw new Error(
            "Impossible de lire le fichier sélectionné. Veuillez le choisir à nouveau.",
          );
        form.append("file", file.file, file.name);
        artifact = await api.request<Artifact>("/api/files", form);
      } else {
        const result = await FileSystem.uploadAsync(`${API_URL}/api/files`, file.uri, {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "file",
          mimeType: "application/pdf",
          headers: sessionHeaders(api.token),
        });
        const payload = JSON.parse(result.body);
        if (result.status < 200 || result.status >= 300)
          throw new Error(payload.error || "Impossible d’importer ce PDF.");
        artifact = payload;
      }
      await refresh();
      open({ type: "file", file: artifact });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <View style={{ gap: 20 }}>
      <View style={s.between}>
        <Text style={[s.muted, { flex: 1, marginRight: 15 }]}>
          Vos documents, avec de l’espace pour avancer.
        </Text>
        <Button primary icon={Upload} busy={busy} onPress={() => void upload()}>
          Importer un PDF
        </Button>
      </View>
      <ErrorNotice error={error} />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 18 }}>
        {w.files.map((f) => (
          <Pressable
            key={f.id}
            accessibilityRole="button"
            accessibilityLabel={`Ouvrir le PDF : ${f.name}, ${f.pageCount} page${f.pageCount > 1 ? "s" : ""}`}
            accessibilityHint="Ouvrir le lecteur PDF et les actions disponibles."
            onPress={() => open({ type: "file", file: f })}
            style={{ flexGrow: 1, flexBasis: 250, maxWidth: 430 }}
          >
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <View
                style={{
                  height: 175,
                  backgroundColor: colors.sky,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 93,
                    height: 121,
                    borderRadius: 5,
                    backgroundColor: colors.card,
                    padding: 14,
                    transform: [{ rotate: "-4deg" }],
                    borderWidth: 1,
                    borderColor: colors.line,
                  }}
                >
                  <View style={{ marginBottom: 15 }} accessible={false}>
                    <FileText size={16} color={colors.accentDark} />
                  </View>
                  {[100, 75, 90, 95, 60].map((width, i) => (
                    <View
                      key={width}
                      style={{
                        height: 3,
                        backgroundColor: i === 0 ? colors.accentDark : colors.line,
                        width: `${width}%`,
                        marginBottom: 7,
                        borderRadius: 3,
                      }}
                    />
                  ))}
                </View>
                <View style={{ position: "absolute", bottom: 12, right: 14 }}>
                  <Chip>PDF</Chip>
                </View>
              </View>
              <View style={{ padding: 21, gap: 6 }}>
                <Text numberOfLines={1} style={[s.heading, { fontSize: 14 }]}>
                  {f.name}
                </Text>
                <Text style={s.small}>
                  {frenchCount(f.pageCount, "page")} · {Math.max(1, Math.round(f.size / 1024))} Ko
                </Text>
                <View style={[s.between, { marginTop: 9 }]}>
                  <Chip>{f.source}</Chip>
                  <Text style={s.small}>{dateLabel(f.createdAt)}</Text>
                </View>
              </View>
            </Card>
          </Pressable>
        ))}
      </View>
      {!w.files.length && (
        <Card>
          <Empty
            icon={FileText}
            title="Vos documents sont ici"
            detail="Importez un PDF ou ouvrez une pièce jointe pour la lire, remplir les champs compatibles et partager une copie."
          />
        </Card>
      )}
    </View>
  );
}
export function ActivityScreen() {
  const { workspace: w, open, navigate } = useWorkspace();
  const [filter, setFilter] = useState("all");
  const pending = w.actions.filter((a) => a.status === "awaiting_review");
  const actions = w.actions.filter((a) => filter === "all" || a.status === "awaiting_review");
  return (
    <View style={{ gap: 20 }}>
      <View style={[s.row, { gap: 10 }]}>
        <Button
          small
          primary={filter === "all"}
          selected={filter === "all"}
          onPress={() => setFilter("all")}
        >
          Toute l’activité
        </Button>
        <Button
          small
          primary={filter === "review"}
          selected={filter === "review"}
          onPress={() => setFilter("review")}
        >
          À valider · {pending.length}
        </Button>
      </View>
      {actions.length > 0 && (
        <Card>
          <SectionHeading title="Vos actions" />
          {actions.map((a) => (
            <Pressable
              key={a.id}
              accessibilityRole="button"
              accessibilityLabel={`Ouvrir l’action : ${a.title}. ${frenchStatusLabel(a.status)}`}
              onPress={() => open({ type: "review", action: a })}
              style={[
                s.row,
                {
                  gap: 15,
                  minHeight: 64,
                  paddingVertical: 12,
                  borderTopWidth: 1,
                  borderTopColor: colors.line,
                },
              ]}
            >
              <View
                style={[
                  s.iconBox,
                  {
                    backgroundColor:
                      a.status === "awaiting_review" ? colors.lavender : colors.green,
                  },
                ]}
              >
                {a.status === "awaiting_review" ? (
                  <ShieldCheck size={18} color={colors.text} />
                ) : (
                  <CheckCheck size={18} color={colors.text} />
                )}
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={s.text}>{a.title}</Text>
                <Text style={s.small}>{relativeDate(a.createdAt)}</Text>
              </View>
              <Chip
                tint={
                  a.status === "failed"
                    ? colors.errorSurface
                    : a.status === "awaiting_review"
                      ? colors.lavender
                      : colors.canvas
                }
              >
                {frenchStatusLabel(a.status)}
              </Chip>
              <ChevronRight size={16} color={colors.muted} />
            </Pressable>
          ))}
        </Card>
      )}
      {filter === "all" && (
        <Card>
          <SectionHeading title="Historique de l’espace" />
          {w.activity.length ? (
            w.activity.map((a, i) => (
              <View
                key={a.id}
                style={[
                  s.row,
                  {
                    alignItems: "flex-start",
                    gap: 17,
                    paddingVertical: 18,
                    borderTopWidth: i ? 1 : 0,
                    borderTopColor: colors.line,
                  },
                ]}
              >
                <View
                  style={[s.iconBox, { height: 34, width: 34, backgroundColor: colors.canvas }]}
                >
                  <Clock3 size={16} color={colors.muted} />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={s.text}>{a.title}</Text>
                  <Text style={s.muted}>{resultSummary(a.detail)}</Text>
                  <Text style={s.small}>
                    {dateLabel(a.date)} · {timeLabel(a.date)}
                  </Text>
                </View>
                <Chip>{frenchStatusLabel(a.status)}</Chip>
              </View>
            ))
          ) : (
            <Empty
              icon={Clock3}
              title="Rien pour le moment"
              detail="Les actions que vous lancez et leurs résultats apparaîtront dans cet historique."
            >
              <Button small onPress={() => navigate("chat")}>
                Commencer dans le chat
              </Button>
            </Empty>
          )}
        </Card>
      )}
      {filter === "review" && !actions.length && (
        <Card>
          <Empty
            icon={ShieldCheck}
            title="Tout est à jour"
            detail="Les changements de courriel ou de calendrier à valider apparaîtront ici."
          >
            <Button small onPress={() => setFilter("all")}>
              Afficher toute l’activité
            </Button>
          </Empty>
        </Card>
      )}
    </View>
  );
}
export function ConnectionsScreen({ query = "" }: { query?: string }) {
  const { workspace: w, api, refresh, notify, open } = useWorkspace();
  const [selected, setSelected] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function connect(capability: "read" | "write") {
    setBusy(true);
    setError("");
    try {
      const result = await api.request<{ url: string | null; connected?: boolean }>(
        "/api/google/connect",
        { capability },
      );
      if (result.url) {
        await Linking.openURL(result.url);
        notify("Terminez la connexion dans votre navigateur, puis actualisez votre espace.");
      } else {
        await refresh();
        notify("Les données Google locales sont prêtes.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }
  async function disconnect() {
    setBusy(true);
    setError("");
    try {
      await api.request("/api/google/disconnect", {});
      await refresh();
      notify("Google est déconnecté.");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }
  const google = w.connections.find((c) => c.id === "google");
  const connected = google?.status === "connected" || google?.status === "sample";
  const rows: {
    id: string;
    name: string;
    icon: LucideIcon;
    color: string;
    tileColor: string;
    brandIcon?: BrandIconName;
    connected: boolean;
    group: string;
  }[] = [
    {
      id: "gmail",
      name: "Gmail",
      icon: Mail,
      brandIcon: "gmail" as const,
      color: "#EA4335",
      tileColor: "#FFF1EF",
      connected,
      group: "google",
    },
    {
      id: "calendar",
      name: "Google Calendar",
      icon: CalendarDays,
      brandIcon: "google-calendar" as const,
      color: "#4285F4",
      tileColor: "#EEF4FF",
      connected,
      group: "google",
    },
    {
      id: "browser",
      name: "Ordinateur de l’assistant",
      icon: Globe2,
      color: "#5B3E65",
      tileColor: colors.sky,
      connected: w.connections.some((c) => c.id === "browser" && c.status === "connected"),
      group: "browser",
    },
    {
      id: "openbot",
      name: "OpenBot",
      icon: Sparkles,
      color: "#6866A6",
      tileColor: colors.lavender,
      connected: false,
      group: "openbot",
    },
  ].filter((row) => `${row.name} ${row.group}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <View style={{ gap: 22 }}>
      {[true, false].map((isConnected) => {
        const group = rows.filter((row) => row.connected === isConnected);
        if (!group.length) return null;
        return (
          <View key={String(isConnected)} style={{ gap: 8 }}>
            <Text style={[s.small, { marginLeft: 12 }]}>
              {isConnected
                ? w.mode === "sample"
                  ? "Vos connexions"
                  : "Connecté"
                : "Intégrations disponibles"}
            </Text>
            <View style={{ paddingHorizontal: 16, borderRadius: 23, backgroundColor: colors.sky }}>
              {group.map((row, index) => (
                <Pressable
                  key={row.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Gérer ${row.name}`}
                  onPress={() =>
                    row.group === "browser" ? open({ type: "computer" }) : setSelected(row.group)
                  }
                  style={[
                    s.row,
                    {
                      gap: 14,
                      minHeight: 68,
                      borderBottomWidth: index < group.length - 1 ? 1 : 0,
                      borderBottomColor: colors.line,
                    },
                  ]}
                >
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      backgroundColor: row.tileColor,
                      borderWidth: 1,
                      borderColor: colors.line,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {row.brandIcon ? (
                      <BrandIcon name={row.brandIcon} size={23} />
                    ) : (
                      <row.icon size={19} strokeWidth={1.8} color={row.color} />
                    )}
                  </View>
                  <Text style={[s.text, { flex: 1 }]}>{row.name}</Text>
                  {row.connected && row.group === "google" && w.mode === "sample" && (
                    <Text style={s.small}>Données locales</Text>
                  )}
                  {row.connected ? (
                    <ChevronRight size={18} color={colors.muted} />
                  ) : (
                    <Text
                      style={{
                        fontSize: 13,
                        color: row.group === "google" ? colors.accentDark : colors.muted,
                      }}
                    >
                      {row.group === "google" ? "Connecter" : "Configurer"}
                    </Text>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        );
      })}
      {!rows.length && <Text style={s.muted}>Aucun service correspondant.</Text>}
      {selected && (
        <Sheet
          title={selected === "google" ? "Connexions Google" : "OpenBot"}
          subtitle={selected === "google" ? google?.account : "Un ordinateur pour votre assistant"}
          onClose={() => setSelected(undefined)}
        >
          {selected === "google" ? (
            <View style={{ gap: 18 }}>
              <Text style={s.muted}>
                Retrouvez Gmail et Google Agenda dans vos conversations. Commencez par l’accès en
                lecture, puis activez l’envoi et la modification lorsque vous en aurez besoin.
              </Text>
              <View style={[s.row, { gap: 7, flexWrap: "wrap" }]}>
                {google?.capabilities.map((cap) => (
                  <Chip key={cap}>{capabilityLabel(cap)}</Chip>
                ))}
              </View>
              <ErrorNotice error={error} />
              <Button busy={busy} primary icon={Link2} onPress={() => void connect("read")}>
                Connecter Google
              </Button>
              <Button busy={busy} onPress={() => void connect("write")}>
                Autoriser l’envoi et la modification
              </Button>
              {connected && (
                <Button busy={busy} danger onPress={() => void disconnect()}>
                  Déconnecter Google
                </Button>
              )}
              <SettingsLine
                label="Environnement"
                value={w.mode === "sample" ? "Local · données de démonstration" : "Espace en ligne"}
              />
              <SettingsLine
                label="Assistant"
                value={
                  w.runtime.provider === "sample"
                    ? "Parcours guidés"
                    : w.runtime.configured
                      ? "Modèle connecté"
                      : "Modèle non configuré"
                }
              />
              <SettingsLine
                label="Conversations enrichies"
                value={w.runtime.richThreads ? "CopilotKit Intelligence" : "Non connecté"}
              />
              <Button
                small
                icon={ArrowDownToLine}
                onPress={() => void refresh().catch((e) => setError(String(e)))}
              >
                Actualiser les connexions
              </Button>
            </View>
          ) : (
            <View style={{ gap: 14 }}>
              <Text style={s.text}>
                L’adaptateur OpenBot est disponible dans ce projet libre. Le service OpenBot en
                ligne n’est pas encore configuré.
              </Text>
              <Text style={s.muted}>
                Votre ordinateur utilise actuellement le moteur Chromium persistant d’Alineo.
                L’intégration OpenBot enrichira le moteur d’exécution sans changer cette interface.
              </Text>
            </View>
          )}
        </Sheet>
      )}
    </View>
  );
}
function SettingsLine({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={[
        s.between,
        { gap: 15, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
      ]}
    >
      <Text style={s.muted}>{label}</Text>
      <Text style={[s.text, { fontSize: 12, flexShrink: 1, textAlign: "right" }]}>{value}</Text>
    </View>
  );
}

function capabilityLabel(value: string) {
  const scope = value.split("/").at(-1) || value;
  const names: Record<string, string> = {
    "gmail.readonly": "Lire Gmail",
    "gmail.send": "Envoyer des messages avec Gmail",
    "calendar.events.readonly": "Lire les événements du calendrier",
    "calendar.calendarlist.readonly": "Lire la liste des calendriers",
    "calendar.events": "Gérer les événements du calendrier",
    "calendar.readonly": "Lire les calendriers",
  };
  return names[scope] || scope;
}
