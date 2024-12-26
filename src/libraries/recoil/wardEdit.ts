import { atom } from "recoil";

const wardEditingState = atom<number[]>({
  key: "wardEditingState",
  default: [],
});

export default wardEditingState;
