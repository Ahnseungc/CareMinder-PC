import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

const useDeleteMemo = (
  refetch: any,
  setDeleteMemo: React.Dispatch<React.SetStateAction<undefined | number>>,
) => {
  return useMutation({
    mutationFn: (memoId: number) => {
      return axiosInstance.delete("/memo/patient/" + memoId);
    },
    onSuccess: () => {
      refetch();
      setDeleteMemo(undefined);
    },
  });
};

export default useDeleteMemo;
