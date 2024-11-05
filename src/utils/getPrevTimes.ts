function getPrevTimes(createdAt: string) {
  const today = new Date(); //오늘
  const createdDay = new Date(createdAt); //받은 날짜
  const diffMSec = today.getTime() - createdDay.getTime();

  const diffDate = diffMSec / (24 * 60 * 60 * 1000); // 날짜 비교
  const diffHour = diffMSec / (60 * 60 * 1000); // 시 비교
  const diffMin = diffMSec / (60 * 1000); // 분 비교

  if (diffDate >= 1) return Math.floor(diffDate) + "일 전";
  if (diffHour >= 1) return Math.floor(diffHour) + "시간 전";
  if (diffMin >= 1) return Math.floor(diffHour) + "분 전";
  return "방금 전";
}
export default getPrevTimes;
