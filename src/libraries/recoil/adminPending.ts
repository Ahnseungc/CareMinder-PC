import { atom } from "recoil";

const adminPendingState = atom<boolean>({
  key: "adminPendingState",
  default: false,
});

export default adminPendingState;
