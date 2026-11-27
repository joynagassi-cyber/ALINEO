import type { LucideIcon } from 'lucide-react';
import { Activity, ChartNoAxesCombined, MessageCircle, PlugZap, Sparkles } from 'lucide-react';

export type PageId = 'chat' | 'connectors' | 'progress' | 'insights' | 'activity';

export interface NavigationItem {
  id: PageId;
  label: string;
  icon: LucideIcon;
}

export const primaryNavigation: NavigationItem[] = [
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'connectors', label: 'Connecteurs', icon: PlugZap },
  { id: 'progress', label: 'Progression', icon: ChartNoAxesCombined },
  { id: 'insights', label: 'Insights', icon: Sparkles },
];

export const utilityNavigation: NavigationItem = {
  id: 'activity',
  label: 'Activité',
  icon: Activity,
};

export const pageLabels: Record<PageId, string> = {
  chat: 'Chat',
  connectors: 'Connecteurs',
  progress: 'Progression',
  insights: 'Insights',
  activity: 'Activité',
};

export function pageFromHash(hash: string): PageId {
  const page = hash.replace(/^#/, '') as PageId;
  return Object.hasOwn(pageLabels, page) ? page : 'chat';
}
