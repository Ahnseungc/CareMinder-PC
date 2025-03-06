import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

const useEditMemo = () => {
  return useMutation({
    mutationFn: (data: { id: number; content: string }) => {
      return axiosInstance.put("/memo/patient/" + data.id, data.content);
    },
  });
};

export default useEditMemo;
