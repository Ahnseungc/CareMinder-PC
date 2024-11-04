import NoticeDetailRequest from "@libraries/axios/noticeRequestDetail";
import { useQuery } from "@tanstack/react-query";

const getNoticeDetailRequests = async (id: number) => {
  const res = await NoticeDetailRequest.getNoticeDetailRequests(id);
  return res.data.data;
};

export default function useGetNoticeDetail(id: number) {
  const { data, isLoading } = useQuery({
    queryKey: ["getNoticeDetailRequests"],
    queryFn: () => getNoticeDetailRequests(id),
    enabled: !!id,
  });
  return { data, isLoading };
}
