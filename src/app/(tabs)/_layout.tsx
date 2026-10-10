import { TabList, TabSlot, TabTrigger, Tabs } from "expo-router/ui";

import {
  NAV_TABS,
  TabBarButton,
  TabBarIsland,
} from "@/components/layout/tabBar";

export default function TabsLayout() {
  return (
    <Tabs className="flex-1 bg-background">
      <TabSlot />
      <TabList asChild>
        <TabBarIsland>
          {NAV_TABS.map(({ name, href, label, icon, activeIcon }) => (
            <TabTrigger key={name} name={name} href={href} asChild>
              <TabBarButton label={label} icon={icon} activeIcon={activeIcon} />
            </TabTrigger>
          ))}
        </TabBarIsland>
      </TabList>
    </Tabs>
  );
}
