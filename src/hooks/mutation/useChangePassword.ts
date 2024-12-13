import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

export type NewPassword = {
  userIds: number[];
  newPassword: string;
};

const changePassword = async (newPassword: NewPassword) => {
  const res = await axiosInstance.post("/users/change-password", newPassword);
  return res.data;
};

export default function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      console.log("비밀번호 강제 변경 완료");
    },
    onError: error => {
      console.error("비밀번호 변경 실패", error);
    },
  });
}
