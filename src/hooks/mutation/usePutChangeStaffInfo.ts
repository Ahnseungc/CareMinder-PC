import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

export type NewStaffInfo = {
  staffId: number;
  staffRole: string;
  areaIds: number[];
  email: string;
};

const changeStaffInfo = async (newStaffInfo: NewStaffInfo) => {
  const res = await axiosInstance.put("/staffs", newStaffInfo);
  return res.data;
};

export default function useChangeStaffInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeStaffInfo,
    onSuccess: () => {
      console.log("계정 정보 변경 완료");
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
    },
    onError: error => {
      console.error("계정 정보 변경 실패", error);
    },
  });
}
