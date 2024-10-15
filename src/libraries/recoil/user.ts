import { User } from "@models/user";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const userState = atom<User | null>({
  key: `userState`,
  default: null,
  // default: { id: 0, name: "test", type: "admin" },
  effects_UNSTABLE: [persistAtom],
});

export default userState;
