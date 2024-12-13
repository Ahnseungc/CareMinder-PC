import { atom } from "recoil";

const tabletEditingState = atom<number[]>({
  key: "tabletEditingState",
  default: [],
});

export default tabletEditingState;
