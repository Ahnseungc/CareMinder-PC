import { atom } from "recoil";

export const doubleCheckState = atom<boolean>({
  key: "doubleCheckState",
  default: false,
});

export const wardNameCheckState = atom<boolean>({
  key: "wardNameDoubleCheckState",
  default: false,
});
