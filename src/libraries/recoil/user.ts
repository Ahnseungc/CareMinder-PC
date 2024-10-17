import { User } from "@models/user";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const userState = atom<User | null>({
  key: `userState`,
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export default userState;
