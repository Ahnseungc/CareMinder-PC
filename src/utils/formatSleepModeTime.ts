export const formatTime = ({ hour, minute }: { hour: number; minute: number }) => {
  const formattedHour = hour.toString().padStart(2, "0");
  const formattedMinute = minute.toString().padStart(2, "0");

  return `${formattedHour}:${formattedMinute}`;
};

export const formatTimeRange = ({
  startHour,
  startMinute,
  endHour,
  endMinute,
}: {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}) => {
  const start = formatTime({ hour: startHour, minute: startMinute });
  const end = formatTime({ hour: endHour, minute: endMinute });

  return `${start} ~ ${end}`;
};
