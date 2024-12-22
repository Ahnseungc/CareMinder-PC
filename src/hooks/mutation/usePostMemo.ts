import MemoRequest from "@libraries/axios/memoRequest";
import { useMutation } from "@tanstack/react-query";

export type PostMemoType = {
  patientId: number;
  content: string;
};

const postMemo = async (data: PostMemoType) => {
  const res = await MemoRequest.postMemo(data);
  return res.data;
};

export default function usePostMemo() {
  return useMutation({
    mutationFn: (data: PostMemoType) => postMemo(data),
  });
}
