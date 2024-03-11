import { Device } from "@/models";
import { MenuChild } from "@/models/menu.interface";
import { PureSettings } from "@ant-design/pro-layout/lib/defaultSettings";
import { Role } from "./login";

export enum SubscriptionType {
  Free = "Free",
  Linguist = "Linguist",
  Polyglot = "Polyglot",
}

export enum SubscriptionPeriod {
  Monthly = "Monthly",
  Annual = "Annual",
}

export type Locale =
  | "en-US"
  | "es-ES"
  | "fr-FR"
  | "de-DE"
  | "cs-CZ"
  | "sk-SK"
  | "pl-PL"
  | "hu-HU"
  | "zh-CN"
  | "it-IT"
  | "uk-UA";

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

export interface UserLibrary {
  libraryId: string;
  timeStamp: number;
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

  email: string;

  meanings: number;
  alternatives: number;

  settings: PureSettings;
  avatar: string;
  // For backend purposes
  sourceLanguage: string;
  targetLanguage: string;
  verified: boolean;
  activated: boolean;
  isLimitExceeded: boolean;
  exceededAt: Date;
  userLibraries: UserLibrary[];
  picture: string;
  subscribed: boolean;
  subscriptionType: SubscriptionType;
  subscriptionPeriod: SubscriptionPeriod;
  subscriptionId: string;
  isAddVideoExceeded: boolean;
}

export interface UserEntity {
  sourceLanguage?: string | undefined;
  targetLanguage?: string | undefined;
}
