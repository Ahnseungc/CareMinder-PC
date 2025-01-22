import { atom } from "recoil";

const tabletListState = atom<number[]>({
  key: "tabletListState",
  default: [],
});

export default tabletListState;
