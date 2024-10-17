import { atom } from "recoil";

const adminPopupState = atom<boolean>({
  key: "adminPopupState",
  default: true,
});

export default adminPopupState;
