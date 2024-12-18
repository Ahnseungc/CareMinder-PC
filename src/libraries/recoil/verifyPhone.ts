import { atom } from "recoil";

const verifyPhoneState = atom<boolean>({
  key: "verifyPhoneState",
  default: false,
});

export default verifyPhoneState;
