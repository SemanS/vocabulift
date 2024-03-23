import { atom } from "recoil";

export const triggerState = atom({
  key: "triggerState",
  default: { shouldTrigger: false, params: {} },
});
