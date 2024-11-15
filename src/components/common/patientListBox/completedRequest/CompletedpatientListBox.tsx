import { Stack, styled } from "@mui/material";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { bottomScroll, roleColor } from "@utils/homePage";
import { useEffect, useState } from "react";
import { ReactComponent as CheckIcon } from "@/assets/homeIcons/check.svg";
import { StaffListBoxProps } from "@models/home";
import getPrevTimes from "@utils/getPrevTimes";
import ChatBox from "@components/chat/chatBox";
import { LoadChatHistory } from "@components/chat/chattingModel";
import { Message } from "@models/staff";

function CompletedPatientListBox({ isAccept, data, roomId }: StaffListBoxProps) {
  const roleColorPick = roleColor(data.aiRole);

  const [isOptions, setIsOptions] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const onOptionOnOff = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOptions) {
      setIsOptions(false);
    } else if (!isOptions) {
      setIsOptions(true);
    }
  };

  const getHistoryChatting = async () => {
    const history = await LoadChatHistory(data.patientRequestId);
    setMessages(history);
    bottomScroll();
  };

  useEffect(() => {
    if (isAccept) {
      getHistoryChatting();
    }
  }, [data]);

  return (
    <InnerContainer
      color={data.patientRequestId === roomId ? roleColorPick.dark : roleColorPick.light}
    >
      <Title
        color={data.patientRequestId === roomId ? "white" : roleColorPick.dark}
        tabIndex={0}
        onBlur={() => setIsOptions(false)}
      >
        <div>{data.areaSimple.areaName}</div>
        <div>
          <MoreHorizRoundedIcon
            onClick={onOptionOnOff}
            sx={{
              color: data.patientRequestId === roomId ? "white" : "#C4C5CC",
              cursor: "pointer",
            }}
          />
          {isOptions && (
            <Options>
              <Option>복원하기</Option>

              <Option>퇴원 처리하기</Option>
            </Options>
          )}
        </div>
      </Title>
      <Bottom>
        <TxtBox>
          <TxtBoxLeft>
            {data.isNew && <SmallCheck color={roleColorPick.dark}>N</SmallCheck>}
            {data.content}
          </TxtBoxLeft>
          <TxtBoxRight>{getPrevTimes(data.createdAt)}</TxtBoxRight>
        </TxtBox>
        {isAccept && (
          <Check color={roleColorPick.dark}>
            <CheckIcon />
          </Check>
        )}
      </Bottom>
      {isAccept && (
        <div>
          <ChatContainer id="top">
            {messages.map((el, idx) => (
              <ChatBox key={idx} data={el} color={roleColorPick.normal} />
            ))}
            <InputWrapper>
              <Input
                type="text"
                placeholder="현재는 메세지를 입력할 수 없습니다 / 이미 처리 완료된 채팅입니다."
                disabled={true}
              />
              <SendButton></SendButton>
            </InputWrapper>
          </ChatContainer>
        </div>
      )}
    </InnerContainer>
  );
}
export default CompletedPatientListBox;

const InnerContainer = styled(Stack)<{ color: string }>`
  border-radius: 12px;
  background-color: ${({ color }) => color};
  width: 100%;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  cursor: pointer;
`;

const Title = styled("div")<{ color: string }>`
  font-weight: 700;
  font-size: 14px;
  color: ${({ color }) => color};
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  padding-right: 5px;
  position: relative;
`;
const TxtBox = styled("div")`
  border-radius: 6px;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.primary.contrastText};
  padding: 6px 16px 6px 16px;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.primary.dark};
  display: flex;
  justify-content: space-between;
`;
const TxtBoxLeft = styled("div")`
  display: flex;
  align-items: center;
`;
const TxtBoxRight = styled("div")`
  color: ${({ theme }) => theme.palette.text.primary};
  min-width: 60px;
  text-align: end;
`;
const Bottom = styled("div")`
  display: flex;
  width: 100%;
  align-items: end;
  justify-content: space-between;
`;

const SmallCheck = styled("div")<{ color: string }>`
  background-color: ${({ color }) => color};
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  padding-top: 2px;
  justify-content: center;
  margin-right: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.palette.primary.contrastText};
  font-weight: 900;
  margin-bottom: 2px;
`;

const ChatContainer = styled("div")`
  border-top: 1px solid ${({ theme }) => theme.palette.primary.contrastText};
  margin-top: 12px;
  max-height: 400px;
  overflow: auto;
`;
const Options = styled("div")`
  background-color: ${({ theme }) => theme.palette.primary.contrastText};
  position: absolute;
  top: 20px;
  right: 0px;
  padding: 11px;
  box-shadow: 0px 4px 12px 0px #89898e4d;
  border-radius: 8px;
  & > div:first-of-type {
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  }
  & > span {
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.palette.primary.dark};
  }
`;
const Option = styled("div")`
  font-size: 13px;
  color: ${({ theme }) => theme.palette.primary.dark};
  font-weight: 500;
  padding: 8px 0;
  cursor: pointer;
  width: 69px;
  :hover {
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;

const Check = styled("div")<{ color: string }>`
  background-color: ${({ color }) => color};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
  font-weight: 900;
`;
const InputWrapper = styled("div")`
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
