import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

export type NewStaffRole = {
  userIds: number[];
  staffRole: string;
};

const changeStaffRole = async (newStaffRole: NewStaffRole) => {
  const res = await axiosInstance.post("/staffs/change-role", newStaffRole);
  return res.data;
};

export default function useChangeStaffRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeStaffRole,
    onSuccess: () => {
      console.log("직업 변경 완료");
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
    },
    onError: error => {
      console.error("직업 변경 실패", error);
    },
  });
}
