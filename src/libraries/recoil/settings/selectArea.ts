import { atom } from "recoil";

const selectAreaState = atom<number[]>({
  key: "selectAreaState",
  default: [],
});

export default selectAreaState;
