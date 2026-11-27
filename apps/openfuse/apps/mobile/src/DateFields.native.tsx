import { View } from "react-native";
import { Field } from "./ui";
export interface DateFieldsProps {
  label: string;
  date: string;
  time: string;
  allDay: boolean;
  onChange: (date: string, time: string) => void;
}
export default function DateFields({ label, date, time, allDay, onChange }: DateFieldsProps) {
  return (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <View style={{ flex: 1.2 }}>
        <Field
          label={`${label} — date`}
          value={date}
          onChangeText={(value) => onChange(value, time)}
          placeholder="AAAA-MM-JJ"
          keyboardType="numbers-and-punctuation"
        />
      </View>
      {!allDay && (
        <View style={{ flex: 1 }}>
          <Field
            label={`${label} — heure`}
            value={time}
            onChangeText={(value) => onChange(date, value)}
            placeholder="HH:MM (24 h)"
            keyboardType="numbers-and-punctuation"
          />
        </View>
      )}
    </View>
  );
}
