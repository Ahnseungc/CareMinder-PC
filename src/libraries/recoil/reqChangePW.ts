import { atom } from "recoil";

const reqChangePWState = atom<boolean>({
  key: "reqChangePWState",
  default: false,
});

export default reqChangePWState;
