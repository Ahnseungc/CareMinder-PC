import MemoRequest from "@libraries/axios/memoRequest";
import { useQuery } from "@tanstack/react-query";

const getMemoRequest = async (patientId: number) => {
  const res = await MemoRequest.getMemoRequest(patientId);
  return res.data;
};

export default function useGetMemo(patientId: number) {
  const { data, isLoading } = useQuery({
    queryKey: ["useGetMemo", patientId],
    retry: 3,
    retryDelay: 1000,
    queryFn: () => getMemoRequest(patientId),
  });
  return { data, isLoading };
}
