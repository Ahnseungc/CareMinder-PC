import { atom } from "recoil";

const doubleCheckState = atom<boolean>({
  key: "doubleCheckState",
  default: false,
});

export default doubleCheckState;
