import { atom } from "recoil";

export const sourceLanguageState = atom<"en" | "sk" | "cz">({
  key: "sourceLanguageState",
  default: "en",
});

export const targetLanguageState = atom<"en" | "sk" | "cz">({
  key: "targetLanguageState",
  default: "sk",
});
