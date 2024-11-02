import { styled } from "@mui/material";
import { SendChat } from "./chattingModel";
import { useState } from "react";

function ChatInput({
  roomId,
  Icon,
  setRoomId,
}: {
  roomId: number;
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  setRoomId: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const [chat, setChat] = useState("");
  const onSend = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    SendChat(chat, setChat, roomId, setRoomId);
  };

  return (
    <Wrapper>
      <Input
        type="text"
        placeholder="메세지를 입력해 주세요"
        onClick={e => e.stopPropagation()}
        onChange={e => setChat(e.target.value)}
        value={chat}
      />
      <SendButton onClick={onSend}>
        <Icon />
      </SendButton>
    </Wrapper>
  );
}
export default ChatInput;

const Wrapper = styled("div")`
  margin-top: 41px;
  width: 100%;
  background-color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
`;
const Input = styled("input")`
  width: 100%;
  border: none;
  padding: 10px;
  border-radius: 10px 0 0 10px;
  background-color: transparent;
`;
const SendButton = styled("div")`
  padding: 4px 10px 0 10px;
  border-radius: 0 10px 10px 0;
  cursor: pointer;
`;
