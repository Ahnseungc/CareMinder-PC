import { NoticeRequest } from "@libraries/axios";
import { useQuery } from "@tanstack/react-query";

const getNoticeRequests = async () => {
  const res = await NoticeRequest.getNoticeRequests();
  return res.data.data;
};

export default function useGetNotice() {
  const { data, isLoading } = useQuery({
    queryKey: ["useGetPatientRequest"],
    queryFn: getNoticeRequests,
  });
  return { data, isLoading };
}
