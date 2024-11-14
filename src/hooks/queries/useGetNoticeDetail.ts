import NoticeDetailRequest from "@libraries/axios/noticeRequestDetail";
import { useQuery } from "@tanstack/react-query";

const getNoticeDetailRequests = async (id: number) => {
  const res = await NoticeDetailRequest.getNoticeDetailRequests(id);

  return res.data || {};
};

export default function useGetNoticeDetail(id?: number) {
  const { data, isLoading } = useQuery({
    queryKey: ["getNoticeDetailRequests", id],
    queryFn: () => getNoticeDetailRequests(id as number),
    enabled: !!id,
  });
  return { data, isLoading };
}
