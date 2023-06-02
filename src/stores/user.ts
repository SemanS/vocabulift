import { atom } from "recoil";
import { Role } from "@/models/login";
import { Locale, User, UserEntity } from "@/models/user";
import { getGlobalState } from "@/models";

const initialState: User = {
  ...getGlobalState(),
  locale: (localStorage.getItem("locale")! ||
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    "en-us") as Locale,
  newUser: JSON.parse(localStorage.getItem("newUser")!) ?? true,
  isLogged: false,
  menuList: [],
  username: localStorage.getItem("username") || "",
  role: (localStorage.getItem("username") || "") as Role,
  avatar:
    "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
  library: [],
  sourceLanguage: "en",
  targetLanguage: "sk",
  verified: false,
  activated: false,
  isLimitExceeded: false,
  exceededAt: new Date(2023, 5, 2),
};

export const userState = atom({
  key: "userState",
  default: initialState,
});
