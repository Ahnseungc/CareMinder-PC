import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

export interface NewStaffInfoData {
  staffId: number;
  staffRole: string;
  areaIds: number[];
  password?: string;
  email: string;
}

const changeStaffSettingInfo = async (newStaffInfo: NewStaffInfoData) => {
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
