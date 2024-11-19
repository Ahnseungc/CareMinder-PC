import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

export type NewStaffArea = {
  userIds: number[];
  areaId: number;
};

const changeStaffArea = async (newStaffArea: NewStaffArea) => {
  const res = await axiosInstance.post("/staffs/change-area", newStaffArea);
  return res.data;
};

export default function useChangeStaffArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeStaffArea,
    onSuccess: () => {
      console.log("구역 변경 완료");
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
    },
    onError: error => {
      console.error("직업 변경 실패", error);
    },
  });
}
