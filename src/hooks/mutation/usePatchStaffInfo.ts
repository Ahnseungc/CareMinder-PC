import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";
import { NewStaffInfo } from "./usePutChangeStaffInfo";

const changeStaffSettingInfo = async (newStaffInfo: NewStaffInfo & { password: string }) => {
  const res = await axiosInstance.patch("/staffs", newStaffInfo);
  return res.data;
};

export default function useChangeStaffSettingInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeStaffSettingInfo,
    onSuccess: () => {
      console.log("계정 정보 변경 완료");
      queryClient.invalidateQueries({ queryKey: ["staffInfo"] });
    },
    onError: error => {
      console.error("계정 정보 변경 실패", error);
    },
  });
}
