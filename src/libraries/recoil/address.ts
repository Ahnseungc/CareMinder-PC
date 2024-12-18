import { atom } from "recoil";

export type HospitalAddress = {
  roadAddress: string;
  zonecode: string;
};

const addressState = atom<HospitalAddress | null>({
  key: "addressState",
  default: null,
});

export default addressState;
