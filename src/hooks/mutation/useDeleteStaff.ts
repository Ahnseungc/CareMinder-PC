import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

type DeleteStaffResponse = {
  userIds: number[];
  accountType: string;
};

const deleteStaff = async (deleteStaffData: DeleteStaffResponse) => {
  const res = await axiosInstance.delete("/staffs", {
    data: deleteStaffData,
  });
  return res.data;
};

export default function useDeleteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      console.log("스태프 계정 삭제 완료");
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
      queryClient.invalidateQueries({ queryKey: ["staffSimpleList"] });
    },
    onError: error => {
      console.error("스태프 계정 삭제 실패", error);
    },
  });
}
