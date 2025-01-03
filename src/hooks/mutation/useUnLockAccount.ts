import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";
import { LockInfo } from "./useLockAccount";

const unLockAccount = async (data: LockInfo) => {
  return (await axiosInstance.post("/users/unlock-accounts", data)).data;
};

export default function useUnLockAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unLockAccount,
    onSuccess: () => {
      console.log("계정 잠금 해제 완료");
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
      queryClient.invalidateQueries({ queryKey: ["wardList"] });
    },
    onError: error => {
      console.error("계정 잠금 해제 실패", error);
    },
  });
}
