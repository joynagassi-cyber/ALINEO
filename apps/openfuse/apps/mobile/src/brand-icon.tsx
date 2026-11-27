import { SvgXml } from "react-native-svg";
import gmail from "thesvg/gmail";
import googleCalendar from "thesvg/google-calendar";

export type BrandIconName = "gmail" | "google-calendar";

const brandIcons = {
  gmail,
  "google-calendar": googleCalendar,
} satisfies Record<BrandIconName, typeof gmail>;

/** Small, authentic service marks for connector rows; lucide remains the UI-control icon set. */
export function BrandIcon({ name, size = 21 }: { name: BrandIconName; size?: number }) {
  return <SvgXml xml={brandIcons[name].svg} width={size} height={size} accessible={false} />;
}
