import { atom } from "recoil";

export const sourceLanguageState = atom({
  key: "sourceLanguageState",
  default: "en",
});

export const targetLanguageState = atom({
  key: "targetLanguageState",
  default: "sk",
});

export const menuLanguageState = atom({
  key: "menuLanguageState",
  default: navigator.language || "sk-SK",
});

export const uniqueLanguagesState = atom<string[]>({
  key: "uniqueLanguagesState",
  default: [],
});
