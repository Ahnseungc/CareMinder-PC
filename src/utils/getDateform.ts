export function formatDate(date: Date): string {
  // 한국 표준시로 변환하기 위해 9시간을 더합니다.
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  // 두 자릿수 형식을 맞추기 위해 padStart 사용
  const year = kstDate.getFullYear();
  const month = String(kstDate.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 필요
  const day = String(kstDate.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

export function formatDateDash(date: Date): string {
  // 한국 표준시로 변환하기 위해 9시간을 더합니다.
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  // 두 자릿수 형식을 맞추기 위해 padStart 사용
  const year = kstDate.getFullYear();
  const month = String(kstDate.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 필요
  const day = String(kstDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatDateYYYYMMDD(date: Date | null): string {
  if (!date) return ""; // 날짜가 null인 경우 처리

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
  const day = date.getDate();

  // 2024-12-2 형식으로 반환
  return `${year}-${month}-${day}`;
}
