import { atom } from "recoil";

const accountActiveState = atom<boolean>({
  key: "accountActiveState",
  default: false,
});

export default accountActiveState;
