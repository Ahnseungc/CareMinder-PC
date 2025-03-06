import MemoRequest from "@libraries/axios/memoRequest";
import { useQuery } from "@tanstack/react-query";

const getPatientMemo = async (patientId: number) => {
  const res = await MemoRequest.getPatientMemoRequest(patientId);
  return res.data;
};

export default function useGetPatientMemo(patientId: number, selLength: number) {
  const { data, refetch } = useQuery({
    queryKey: ["useGetMemoPatient", patientId],
    queryFn: () => getPatientMemo(patientId),
    enabled: selLength === 1,
  });
  return { data, refetch };
}
