import { atom } from "recoil";

const wardListState = atom<number[]>({
  key: "wardListState",
  default: [],
});

export default wardListState;
