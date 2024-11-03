import { styled } from "@mui/material";
import { formatTimestamp } from "@utils/homePage";

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
  formatTimestamp(data.createdAt);
  const leftOrRight = data.role === "TABLET" ? "left" : "right";
  return (
    <>
      <Wrapper leftOrRight={leftOrRight}>
        {leftOrRight === "left" ? (
          <>
            <Title color={"white"}>{data.content}</Title>
            <Time>오전 06:30</Time>
          </>
        ) : (
          <>
            <Time>오전 06:30</Time>
            <Title color={color}>{data.content}</Title>
          </>
        )}
      </Wrapper>
      {/* <input type="text" value={chatInput} />
      <button onClick={sendMessage}>제출</button> */}
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
const Title = styled("div")<{ color: string }>`
  width: fit-content;
  background-color: ${({ color }) => color};
  padding: 8px 15px;
  border-radius: 8px;
`;
