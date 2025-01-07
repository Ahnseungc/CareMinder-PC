function getNewRequest(prevTime: string) {
  //prevTime : 사용자 시간
  // 2025-01-07T12:24:14

  const today = new Date(); //오늘
  const createdDay = new Date(prevTime); //받은 날짜
  const diffMSec = today.getTime() - createdDay.getTime();

  const diffMin = diffMSec / (60 * 1000); // 분 비교
  return diffMin > 10 ? false : true;
}
export default getNewRequest;
