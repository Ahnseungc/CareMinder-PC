import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

const fcmSave = async (FCMToken: string) => {
  const res = await axiosInstance.post(`/fcm/save`, {
    headers: {
      FcmToken: FCMToken,
    },
  });
  return res.data;
};

const useFcmSave = () => {
  return useMutation({
    mutationFn: (FCMToken: string) => {
      return fcmSave(FCMToken);
    },
    onSuccess: () => {},
  });
};

export default useFcmSave;
