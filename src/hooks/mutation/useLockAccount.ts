import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

export type LockInfo = {
  userIds: number[];
};

const lockAccount = async (data: LockInfo) => {
  return (await axiosInstance.post("/users/lock-accounts", data)).data;
};

export default function useLockAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: lockAccount,
    onSuccess: () => {
      console.log("계정 잠금 완료");
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
    },
    onError: error => {
      console.error("계정 잠금 실패", error);
    },
  });
}
