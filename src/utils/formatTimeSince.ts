export const parseKoreanTime = (timeString: string): number => {
  const minutes = timeString.match(/(\d+)분/)?.[1] ?? "0";
  const seconds = timeString.match(/(\d+)초/)?.[1] ?? "0";

  return parseInt(minutes) * 60 + parseInt(seconds);
};

export const formatTimeSince = (timeString: string): string => {
  const totalSeconds = parseKoreanTime(timeString);

  if (totalSeconds < 60) {
    return "1분 전"; // 1분 미만은 "1분 전"으로 통일
  }

  if (totalSeconds < 3600) {
    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes}분 전`;
  }

  if (totalSeconds < 86400) {
    // 24시간(86400초) 미만
    const hours = Math.floor(totalSeconds / 3600);
    return `${hours}시간 전`;
  }

  // 24시간 이상인 경우
  const days = Math.floor(totalSeconds / 86400);
  return `${days}일 전`;
};
