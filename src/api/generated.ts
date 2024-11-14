import { baseApi as api } from "./baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCreate: build.query<GetCreateApiResponse, GetCreateApiArg>({
      query: () => ({ url: `/create` }),
    }),
    getCurrent: build.query<GetCurrentApiResponse, GetCurrentApiArg>({
      query: () => ({ url: `/current` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as generatedApi };
export type GetCreateApiResponse = unknown;
export type GetCreateApiArg = void;
export type GetCurrentApiResponse =
  /** status 200 Successful retrieval of current user */ User;
export type GetCurrentApiArg = void;
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
export const { useGetCreateQuery, useGetCurrentQuery } = injectedRtkApi;
