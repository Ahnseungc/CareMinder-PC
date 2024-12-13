import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

export type AreaInfo = {
  areaId: number;
  name: string;
  memo: string;
};

const updateAreaInfo = async (newAreaInfo: AreaInfo[]) => {
  const res = await axiosInstance.put("/areas", newAreaInfo);
  return res.data;
};

export default function useUpdateAreaInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAreaInfo,
    onSuccess: () => {
      console.log("구역 정보 변경 완료");
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
      queryClient.invalidateQueries({ queryKey: ["areaList"] });
    },
    onError: error => {
      console.error("구역 정보 변경 실패", error);
    },
  });
}
