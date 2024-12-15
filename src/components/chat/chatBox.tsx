import { styled } from "@mui/material";

type ChatData = {
  content: string;
  createdAt: string;
  role: string;
  senderName: string;
  isRead: boolean | null;
  messageId: number;
};
type ChatBoxProps = {
  data: ChatData;
  color: string;
  darkColor?: string;
};

function ChatBox({ data, color, darkColor }: ChatBoxProps) {
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
            <Title color={"white"} leftOrRight={leftOrRight}>
              {data.content}
            </Title>

            <Time>{getTime(data.createdAt)}</Time>
          </>
        ) : (
          <>
            <Side>
              <IsRead isRead={data.isRead ? true : false} color={darkColor!}>
                {/* {data.isRead ? "읽음" : "미확인"} */}
              </IsRead>
              <Time>{getTime(data.createdAt)}</Time>
            </Side>
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
const Side = styled("div")`
  width: 100px;
  text-align: end;
`;
const IsRead = styled("div")<{ isRead: boolean; color: string }>`
  font-size: 12px;
  font-weight: 500;
  margin: 0 10px;
  color: ${({ isRead, color }) => (isRead ? color : "#FF0000CC")};
`;
