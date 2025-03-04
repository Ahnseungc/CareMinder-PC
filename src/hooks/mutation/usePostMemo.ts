import { PostMemoType } from "@components/admin/admininout/modal/memo-modal";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

const usePostMemo = () => {
  return useMutation({
    mutationFn: (data: PostMemoType) => {
      return axiosInstance.post("/memo/patient", data);
    },
  });
};

export default usePostMemo;
