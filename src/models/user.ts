import { Device } from "@/models";
import { MenuChild } from "@/models/menu.interface";
import { PureSettings } from "@ant-design/pro-layout/lib/defaultSettings";
import { Role } from "./login";

export type Locale = "sk-sk" | "en-us";

export interface CurrentUserResult {
  username: string;
  role: Role;
}

export interface LibraryUser {
  id: string;
  href: string | undefined;
  description: string;
  content: string;
  image: string;
  title: string | undefined;
  lastReadPage: number;
  pageSize: number;
  totalSentences: number;
}

export interface User {
  library: LibraryUser[];
  username: string;

  /** menu list */
  menuList: MenuChild[];

  /** login status */
  isLogged: boolean;

  /** role */
  role: Role;

  /** user's device */
  device: Device;

  /** menu collapsed status */
  collapsed: boolean;

  /** user's language */
  locale: Locale;

  /** Is first time to view the site ? */
  newUser: boolean;

  settings: PureSettings;
  avatar: string;
}
