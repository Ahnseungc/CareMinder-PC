import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

const deleteArea = async (areaId: number) => {
  const res = await axiosInstance.delete(`/areas/${areaId}`);
  return res.data;
};

export default function useDeleteArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteArea,
    onSuccess: () => {
      console.log("구역 삭제 완료");
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
      queryClient.invalidateQueries({ queryKey: ["staffSimpleList"] });
      queryClient.invalidateQueries({ queryKey: ["areaList"] });
    },
    onError: error => {
      console.error("구역 삭제 실패", error);
    },
  });
}
