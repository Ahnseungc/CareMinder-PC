import { atom } from "recoil";

const staffListState = atom<number[]>({
  key: "staffListState",
  default: [],
});

export default staffListState;
