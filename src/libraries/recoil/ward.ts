import { User } from "@models/user";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const wardState = atom<User | null>({
  key: `wardState`,
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export default wardState;
