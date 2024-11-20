export type PostLibraryByLibraryIdApiResponse =
  /** status 200 Successfully retrieved library details */ {
    status?: string;
    library?: Library;
  };
export type PostLibraryByLibraryIdApiArg = {
  /** The ID of the library to retrieve */
  libraryId: string;
};
export type BookMetadata = {
  /** The author of the book */
  author?: string;
  /** The title of the book */
  title?: string;
  /** Publication year of the book */
  year?: number;
};
export type SnapshotInfo = {
  /** The ID of the snapshot */
  id?: string;
  /** Creation timestamp of the snapshot */
  createdAt?: string;
  /** Description of the snapshot */
  description?: string;
};
export type Library = {
  /** The title of the library */
  title?: string | null;
  /** The label type */
  label?: "TEXT" | "OTHER_ENUM_VALUES";
  /** The user ID associated with the library */
  userId?: string | null;
  /** The visibility status of the library */
  visibility?: "private" | "public";
  /** URL of the library image */
  image?: string;
  /** A brief description of the library */
  description?: string | null;
  /** The category of the library */
  category?: string | null;
  /** Array of levels associated with the library */
  level?: string[];
  /** ID of the associated video */
  videoId?: string | null;
  /** Thumbnail URL of the associated video */
  videoThumbnail?: string | null;
  /** The total number of sentences in the library */
  totalSentences?: number;
  /** The source language of the library */
  sourceLanguage?: string;
  /** Array of target languages for the library */
  targetLanguages?: string[];
  /** The ID of the associated event */
  eventId?: string;
  bookMetadata?: BookMetadata;
  snapshotsInfo?: SnapshotInfo[];
  /** Total duration of the library content */
  duration?: string;
  /** Worksheet content */
  worksheet?: string;
  /** Transcript content */
  transcript?: string;
  /** List of questions associated with the library */
  questions?: string[];
  /** Enriched features of the library */
  enrichedFeatures?: string[];
};
export type GetUserCreateApiResponse = unknown;
export type GetUserCreateApiArg = void;
export type GetUserCurrentApiResponse =
  /** status 200 Successful retrieval of current user */ User;
export type GetUserCurrentApiArg = void;
export type PostUserUpdateApiResponse =
  /** status 201 User update successful */ {
    status?: string;
  };
export type PostUserUpdateApiArg = {
  body: {
    userEntity?: UserEntity;
  };
};
export type User = {
  /** The user's email address */
  email: string;
  /** The user's password (hashed) */
  password: string;
  /** The user's username */
  username: string;
  /** List of available menus */
  menuList?: {
    path?: string;
    name?: string;
    locale?: string;
    icon?: string;
  }[];
  /** The user's locale setting */
  locale?: string;
  /** The user's source language */
  sourceLanguage?: string;
  /** The user's target language */
  targetLanguage?: string;
  /** Language for meanings or translations */
  languageForMeaning?: string;
  /** Whether the user's email is verified */
  verified: boolean;
  /** Whether the user's account is activated */
  activated: boolean;
  /** Whether the usage limits are exceeded */
  isLimitExceeded?: boolean;
  /** Whether the video addition limit is exceeded */
  isAddVideoExceeded?: boolean;
  /** Date and time when limits were exceeded */
  exceededAt?: string;
  /** Number of watched videos or content */
  watched?: number;
  /** Number of meanings learned or stored */
  meanings?: number;
  /** Number of language alternatives used */
  alternatives?: number;
  /** Unique code associated with the user */
  code?: string;
  /** URL for the user's profile picture */
  picture?: string;
  /** Libraries associated with the user */
  userLibraries?: {
    libraryId?: string;
    timeStamp?: number;
    createdAt?: string;
    updatedAt?: string;
  }[];
  /** Subscription status of the user */
  subscribed?: boolean;
  /** Identifier for the user's subscription, if any */
  subscriptionId?: string | null;
  /** Indicator for new user status */
  newUser?: boolean;
  /** Code for partnered users or affiliations */
  partnerCode?: string;
  /** Type of subscription the user has */
  subscriptionType?: "Free" | "Linguist" | "Polyglot" | "Fail";
  /** Subscription billing period */
  subscriptionPeriod?: ("Monthly" | "Annual") | null;
};
export type UserEntity = {
  /** Number of watched videos or content */
  watched?: number;
  /** Date and time when limits were exceeded */
  exceededAt?: string;
  /** The user's source language */
  sourceLanguage?: string;
  /** The user's target language */
  targetLanguage?: string;
  /** Language used for meanings or translations */
  languageForMeaning?: string;
  /** Whether the user's email is verified */
  verified?: boolean;
  /** Whether the user's account is activated */
  activated?: boolean;
  /** List of libraries associated with the user */
  userLibraries?: {
    /** The unique identifier for the library */
    libraryId?: string;
    /** Timestamp of the library action */
    timeStamp?: number;
    /** Date and time of library creation */
    createdAt?: string;
    /** Date and time of the last library update */
    updatedAt?: string;
  }[];
  /** Whether the usage limits are exceeded */
  isLimitExceeded?: boolean;
  /** Whether the video addition limit is exceeded */
  isAddVideoExceeded?: boolean;
  /** Number of meanings learned or stored */
  meanings?: number;
  /** Number of language alternatives used */
  alternatives?: number;
  /** Indicator for new user status */
  newUser?: boolean;
  /** Code for partnered users or affiliations */
  partnerCode?: string;
  /** The user's locale preference */
  locale?: string;
};