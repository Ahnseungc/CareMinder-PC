import MemoRequest from "@libraries/axios/memoRequest";
import { useMutation } from "@tanstack/react-query";

export type PutMemoType = {
  memoId: number;
  changeMemo: string;
};

const putMemo = async (data: PutMemoType) => {
  const res = await MemoRequest.putMemo(data);
  return res.data;
};

export default function usePutMemo() {
  return useMutation({
    mutationFn: (data: PutMemoType) => putMemo(data),
  });
}
