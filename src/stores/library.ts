import { atom } from "recoil";

export const libraryIdState = atom<string>({
  key: "libraryIdState",
  default: undefined,
});

export const currentPageState = atom<number>({
  key: "currentPageState",
  default: 1,
});

export const pageSizeState = atom<number>({
  key: "pageSizeState",
  default: 10,
});
