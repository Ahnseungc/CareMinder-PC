import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

export type NewWardInfo = {
  wardId: number;
  wardName: string;
  managerName: string;
  managerEmail: string;
};

const changeWardInfo = async (newWardInfo: NewWardInfo) => {
  const res = await axiosInstance.put("/wards", newWardInfo);
  return res.data;
};

export default function useChangeWardInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeWardInfo,
    onSuccess: () => {
      console.log("병동 계정 정보 변경 완료");
      queryClient.invalidateQueries({ queryKey: ["wardList"] });
    },
    onError: error => {
      console.error("병동 계정 정보 변경 실패", error);
    },
  });
}
