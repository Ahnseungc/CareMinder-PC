import { atom } from "recoil";

const autoCompleteIdState = atom<string>({
  key: "autoCompleteId",
  default: "",
});

export default autoCompleteIdState;
