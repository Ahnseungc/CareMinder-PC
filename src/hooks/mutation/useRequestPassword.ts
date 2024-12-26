import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

export type RequestPassword = {
  userIds: number[];
  accountType: string;
};

const requestChangePassword = async (reqPassword: RequestPassword) => {
  const res = await axiosInstance.post("/users/request-password-change", reqPassword);
  return res.data;
};

export default function useReqChangePassword() {
  return useMutation({
    mutationFn: requestChangePassword,
    onSuccess: () => {
      console.log("비밀번호 변경 요청 완료");
    },
    onError: error => {
      console.error("비밀번호 변경 요청 실패", error);
    },
  });
}
