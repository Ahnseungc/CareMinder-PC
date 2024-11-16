import { styled } from "@mui/material";

type ChatData = {
  content: string;
  createdAt: string;
  role: string;
  senderName: string;
};
type ChatBoxProps = {
  data: ChatData;
  color: string;
};

function ChatBox({ data, color }: ChatBoxProps) {
  const leftOrRight = data.role === "TABLET" ? "left" : "right";

  const makeTwoDigits = (time: number) => {
    return time >= 10 ? time : "0" + time;
  };

  const getTime = (createdAt: string) => {
    const time = new Date(createdAt);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    if (hours === 12) return "오후 " + makeTwoDigits(hours) + ":" + makeTwoDigits(minutes);
    if (hours > 12) return "오후 " + makeTwoDigits(hours - 12) + ":" + makeTwoDigits(minutes);
    if (hours < 12) return "오전 " + makeTwoDigits(hours) + ":" + makeTwoDigits(minutes);
  };

  return (
    <>
      <Wrapper leftOrRight={leftOrRight}>
        {leftOrRight === "left" ? (
          <>
            <Title color={"white"}>{data.content}</Title>
            <Time>{getTime(data.createdAt)}</Time>
          </>
        ) : (
          <>
            <Time>{getTime(data.createdAt)}</Time>
            <Title color={color} leftOrRight={leftOrRight}>
              {data.content}
            </Title>
          </>
        )}
      </Wrapper>
    </>
  );
}
export default ChatBox;

const Wrapper = styled("div")<{ leftOrRight: string }>`
  padding-top: 18px;
  color: black;
  display: flex;
  align-items: end;
  justify-content: ${({ leftOrRight }) => (leftOrRight === "left" ? "start" : "end")};
`;
const Time = styled("div")`
  color: #5e5f65;
  font-size: 13px;
  margin: 0 10px;
`;
const Title = styled("div")<{ color: string; leftOrRight: string }>`
  width: fit-content;
  background-color: ${({ color }) => color};
  margin-right: ${({ leftOrRight }) => leftOrRight === "right" && "10px"};
  padding: 8px 15px;
  border-radius: 8px;
`;
