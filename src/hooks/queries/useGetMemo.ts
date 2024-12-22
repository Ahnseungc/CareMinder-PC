import MemoRequest from "@libraries/axios/memoRequest";
import { useQuery } from "@tanstack/react-query";

export type GetMemoRes = {
  staffName: string;
  staffRole: string;
  content: string;
  createdAt: string;
};
const getMemo = async (patientId: number) => {
  const res = await MemoRequest.getMemo(patientId);
  return res.data;
};

export default function useGetMemo(patientId: number) {
  const { data, refetch } = useQuery<GetMemoRes[]>({
    queryKey: ["getMemo", patientId],
    queryFn: () => getMemo(patientId),
  });
  return { data, refetch };
}
