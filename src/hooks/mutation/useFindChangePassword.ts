import { useMutation } from "@tanstack/react-query";
import axiosInstance, { CustomAxiosRequestConfig } from "@utils/axios/axiosInstance";

type propsData = {
  newPassword: string;
  accessToken: string;
};

const findChangePassword = async (data: propsData) => {
  const res = await axiosInstance.post(
    "/users/me/change-password",
    { newPassword: data.newPassword },
    {
      headers: { Authorization: `Bearer ${data.accessToken}` },
      customHeader: true,
    } as CustomAxiosRequestConfig,
  );
  return res.data;
};

export default function useFindChangePassword() {
  return useMutation({
    mutationFn: findChangePassword,
    onError: error => {
      console.error("비밀번호 변경 실패", error);
    },
  });
}
