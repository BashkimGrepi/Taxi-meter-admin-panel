import { useMemo } from "react";
import { usePermissions } from "./usePermissions";
import { NAVIGATION_ITEMS, NavigationItem } from "../config/navigation";

export const useNavigation = () => {
  const { isAdminOrManager } = usePermissions();

  const filteredNavItems = useMemo(() => {
    return NAVIGATION_ITEMS.filter(
      (item) => !item.adminOnly || isAdminOrManager
    );
  }, [isAdminOrManager]);

  const groupedNavItems = useMemo(() => {
    const groups: { [key: string]: NavigationItem[] } = {};
    const ungrouped: NavigationItem[] = [];

    filteredNavItems.forEach((item) => {
      if (item.section) {
        if (!groups[item.section]) {
          groups[item.section] = [];
        }
        groups[item.section].push(item);
      } else {
        ungrouped.push(item);
      }
    });

    return { groups, ungrouped };
  }, [filteredNavItems]);

  return {
    navItems: filteredNavItems,
    groupedNavItems,
  };
};
