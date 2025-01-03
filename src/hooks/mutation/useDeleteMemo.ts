import MemoRequest from "@libraries/axios/memoRequest";
import { useMutation } from "@tanstack/react-query";

const deleteMemo = async (memoId: number) => {
  const res = await MemoRequest.deleteMemo(memoId);
  return res.data;
};

export default function useDeleteMemo() {
  return useMutation({
    mutationFn: (memoId: number) => deleteMemo(memoId),
  });
}
