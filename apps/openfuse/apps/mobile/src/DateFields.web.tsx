import { View } from "react-native";
import { colors } from "./ui";

interface DateFieldsProps {
  label: string;
  date: string;
  time: string;
  allDay: boolean;
  onChange: (date: string, time: string) => void;
}
export default function DateFields({ label, date, time, allDay, onChange }: DateFieldsProps) {
  const id = `alineo-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const style = {
    border: `1px solid ${colors.control}`,
    borderRadius: 12,
    padding: 13,
    fontSize: 16,
    lineHeight: "normal",
    color: colors.text,
    background: colors.card,
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box" as const,
    minHeight: 48,
  };
  return (
    <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
      <View style={{ flex: 1.2, gap: 7 }}>
        <label htmlFor={`${id}-date`} style={{ color: colors.text, fontSize: 12, fontWeight: 600 }}>
          {label} — date
        </label>
        <input
          id={`${id}-date`}
          aria-label={`${label} — date`}
          type="date"
          value={date}
          onChange={(e) => onChange(e.target.value, time)}
          style={style}
        />
      </View>
      {!allDay && (
        <View style={{ flex: 1, gap: 7 }}>
          <label
            htmlFor={`${id}-time`}
            style={{ color: colors.text, fontSize: 12, fontWeight: 600 }}
          >
            {label} — heure
          </label>
          <input
            id={`${id}-time`}
            aria-label={`${label} — heure`}
            type="time"
            value={time}
            onChange={(e) => onChange(date, e.target.value)}
            style={style}
          />
        </View>
      )}
    </View>
  );
}
