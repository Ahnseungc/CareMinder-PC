import MemoRequest from "@libraries/axios/memoRequest";
import { useQuery } from "@tanstack/react-query";

const getPatientMemo = async (patientId: number[]) => {
  const res = await MemoRequest.getPatientMemoRequest(patientId);
  return res.data;
};

export default function useGetPatientMemo(patientId: number[]) {
  const { data, refetch } = useQuery({
    queryKey: ["useGetMemoPatient", patientId],
    queryFn: () => getPatientMemo(patientId),
  });
  return { data, refetch };
}
