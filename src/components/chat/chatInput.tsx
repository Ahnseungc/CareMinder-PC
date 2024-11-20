import { styled } from "@mui/material";
import { SendChat } from "./chattingModel";
import { useState } from "react";

function ChatInput({
  roomId,
  Icon,
  setRoomId,
  color,
}: {
  roomId: number;
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  setRoomId: React.Dispatch<React.SetStateAction<number | null>>;
  color: string;
}) {
  const [chat, setChat] = useState("");
  const testData = [
    "자동완성된 텍스트 입니다. 텍스트 입니다. 텍스트 입니다321321. ",
    "자동완성된 텍스트 입니다. 텍스트 입니다. 텍스트 입니다.dsadsa ",
    "자동완성된 텍스트 입니다. 텍스트 입니다. 텍스트 입니다.ewqwq ",
    "자동완성된 텍스트 입니다. 텍스트 입니다. 텍스트 입니다.dsa 자동완성된 텍스트 입니다. 텍스트 입니다. 텍스트 입니다.dsa 자동완성된 텍스트 입니다. 텍스트 입니다. 텍스트 입니다.dsa 자동완성된 텍스트 입니다. 텍스트 입니다. 텍스트 입니다.dsa 자동완성된 텍스트 입니다. 텍스트 입니다. 텍스트 입니다.dsa 자동완성된 텍스트 입니다. 텍스트 입니다. 텍스트 입니다.dsa ",
    "자동완성된 텍스트 입니다. 텍스트 입니다. 텍스트 입니다. ",
  ];

  const onSend = (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (chat.trim().length === 0) return;
    SendChat(chat, setChat, roomId, setRoomId);
  };
  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (e.nativeEvent.isComposing) return;
      onSend(e);
    }
  };

  const onWordComplete = (e: React.MouseEvent<HTMLDivElement>, el: string) => {
    e.stopPropagation();
    setChat(el);
  };

  return (
    <>
      <WordComplete id="word">
        {testData.map(el => (
          <Word color={color} onClick={e => onWordComplete(e, el)}>
            {el}
            <WordView>{el}</WordView>
          </Word>
        ))}
      </WordComplete>
      <Wrapper>
        <Input
          type="text"
          placeholder="메세지를 입력해 주세요"
          onClick={e => e.stopPropagation()}
          onChange={e => setChat(e.target.value)}
          value={chat}
          onKeyDown={onEnter}
        />
        <SendButton onClick={onSend}>
          <Icon />
        </SendButton>
      </Wrapper>
    </>
  );
}
export default ChatInput;
const WordComplete = styled("div")`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 40px;
  position: relative;
`;
const WordView = styled("div")`
  position: absolute;
  background-color: white;
  color: #231f20;
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  bottom: 70px;
  left: 0;
  display: none;
  white-space: normal;
`;
const Word = styled("div")<{ color: string }>`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 10px 13.5px;
  font-size: 14px;
  background-color: white;
  color: #231f20;
  margin: 0 10px;
  border-radius: 999px;
  font-weight: 400;
  :hover {
    background-color: ${({ color }) => color};
    cursor: pointer;
    color: white;
    & > div {
      display: block;
    }
  }
`;
const Wrapper = styled("div")`
  margin-top: 20px;
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
  :focus {
    outline: none;
  }
`;
const SendButton = styled("div")`
  padding: 4px 10px 0 10px;
  border-radius: 0 10px 10px 0;
  cursor: pointer;
`;
