import { atom } from "recoil";

const editingState = atom<number[]>({
  key: "editingState",
  default: [],
});

export default editingState;
