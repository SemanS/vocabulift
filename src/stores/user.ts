import { atom, useRecoilTransactionObserver_UNSTABLE } from "recoil";
import { Role } from "@/models/login";
import {
  Locale,
  SubscriptionPeriod,
  SubscriptionType,
  User,
} from "@/models/user";
import { getGlobalState } from "@/models";

const initialState: User = {
  ...getGlobalState(),
  locale: (localStorage.getItem("locale")! ||
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    "en-US") as Locale,
  newUser: JSON.parse(localStorage.getItem("newUser")!) ?? true,
  isLogged: false,
  menuList: [],
  username: localStorage.getItem("username") || "",
  role: (localStorage.getItem("username") || "") as Role,
  avatar:
    "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
  library: [],
  email: "slavosmn@gmail.com",
  sourceLanguage: "en",
  targetLanguage: "sk",
  verified: false,
  activated: false,
  isLimitExceeded: false,
  subscribed: false,
  exceededAt: new Date(2023, 5, 2),
  userLibraries: [
    {
      libraryId: "6478fdc0d220b2b50883b874",
      timeStamp: 5,
    },
  ],
  picture:
    "https://lh3.googleusercontent.com/ogw/AOLn63G44ZepIWVlalbQumSaDkFtQfP2w3PHBvGPjSg1=s32-c-mo",
  subscriptionType: SubscriptionType.Linguist,
  subscriptionPeriod: SubscriptionPeriod.Monthly,
  subscriptionId: "123",
  meanings: 0,
  alternatives: 0,
};

const localStorageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue) => {
      if (newValue === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    });
  };

export const userState = atom({
  key: "userState",
  default: initialState,
  effects_UNSTABLE: [localStorageEffect("userState")],
});
