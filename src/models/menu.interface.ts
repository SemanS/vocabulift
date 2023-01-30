interface MenuItem {
  /** menu item name */
  name: string;
  /** menu labels */
  label: {
    zh_CN: string;
    en_US: string;
  };

  icon?: string;

  key: string;

  path: string;

  children?: MenuItem[];
}

export type MenuChild = Omit<MenuItem, "children">;

export type MenuList = MenuItem[];
