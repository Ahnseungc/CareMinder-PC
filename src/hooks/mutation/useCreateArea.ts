import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

export type AreaData = {
  name: string;
  wardId: number;
  memo: string;
};

const createArea = async (areaData: AreaData) => {
  const res = await axiosInstance.post("/areas", areaData);
  return res.data;
};

export default function useCreateArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createArea,
    onSuccess: () => {
      console.log("구역 추가 완료");
      queryClient.invalidateQueries({ queryKey: ["areaList"] });
      queryClient.invalidateQueries({ queryKey: ["ward-area-List"] });
    },
    onError: error => {
      console.error("구역 추가 실패", error);
    },
  });
}
