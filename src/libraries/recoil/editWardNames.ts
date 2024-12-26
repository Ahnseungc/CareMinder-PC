import { atom } from "recoil";

export interface EditedWardNames {
  [wardId: number]: string;
}

export const editedWardNamesState = atom<EditedWardNames>({
  key: "editedWardNamesState",
  default: {},
});
