import { useState } from "react";

import { styled } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { ReactComponent as MoreHorizRoundedIcon } from "@/assets/homeIcons/Dot.svg";
import { ReactComponent as VectorIcon } from "@/assets/homeIcons/Dark_Vector.svg";
import { ReactComponent as CheckIcon } from "@/assets/homeIcons/check.svg";

import { bottomScroll, roleColor } from "@utils/homePage";
import getPrevTimes from "@utils/getPrevTimes";

import { MainListBoxProps } from "@models/home";
import { Message } from "@models/staff";

import { ConnectChat, DisConnect, LoadChatHistory } from "@components/chat/chattingModel";
import ChatInput from "@components/chat/chatInput";
import ChatBox from "@components/chat/chatBox";
// import useStaffChangeRole from "@hooks/mutation/useStaffChangeRole";
import usePatientDischargeByWeb from "@hooks/mutation/usePatientDischargeByWeb";
import { useStaffDecline } from "@hooks/mutation";
import MemoBox from "../MemoBox/MemoBox";
import * as S from "../Style/listBox.style";

function StaffPatientListBox({
  isAccept,
  data,
  onMutates,
  roomId,
  setRoomId,
  refetchProps,
}: MainListBoxProps) {
  const roleColorPick = roleColor(data.aiRole);

  const [isOptions, setIsOptions] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isMemo, setIsMemo] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // const { mutate: mutateRole } = useStaffChangeRole(pendingRefetch);

  const { mutate: mutateDischargeByWeb } = usePatientDischargeByWeb(refetchProps!);
  const { mutate: mutateDecline } = useStaffDecline(refetchProps!);
  // const { mutate: mutateReadMs } = useReadMessage(roomId!);

  const onOptionOnOff = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOptions(true);
    if (isOptions || isEdit) {
      setIsEdit(false);
      setIsOptions(false);
    }
  };

  const onOpenChatting = async (id: number) => {
    if (!isAccept) {
      return;
    }

    if (roomId !== id) {
      DisConnect(setRoomId!, roomId);
      ConnectChat(id, setMessages);
      const history = await LoadChatHistory(id);
      setMessages(history);
      setIsMemo(true);
      setRoomId!(id);
      bottomScroll();
    }
    if (roomId === id) {
      DisConnect(setRoomId!, roomId);
      setRoomId!(null);
      setIsMemo(false);
    }
  };

  // const onChangePatientRole = (value: CSwitchProps) => {
  //   mutateRole({
  //     aiRole: isFindRole(value)!,
  //     patientRequestId: data.patientRequestId,
  //   });
  //   setIsEdit(false);
  //   setIsOptions(false);
  // };

  const onCancelAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    mutateDecline(data.patientRequestId);
  };

  // useEffect(() => {
  //   console.log(messages.length);
  // if (messages.length === 0) return;
  // const filterMessages = messages.filter(el => el.role === "TABLET");
  // if (filterMessages.length === 0) return;
  // const userInfo = filterMessages[filterMessages.length - 1];
  // mutateReadMs(userInfo.messageId);
  // }, [messages]);

  return (
    <S.InnerContainer
      color={roleColorPick.light}
      onClick={() => onOpenChatting(data.patientRequestId)}
    >
      <S.LeftLine color={roleColorPick.dark}></S.LeftLine>
      <S.Title color={roleColorPick.dark} tabIndex={0} onBlur={() => setIsOptions(false)}>
        <div>
          <div>
            {data.areaSimple.areaName} ({data.tabletSimple.tabletName})
          </div>
          <span> | </span>
          <div>{data.patientSimple.patientName}</div>
        </div>
        <S.TitleRight
          onClick={e => {
            e.stopPropagation(), setIsMemo(prev => !prev);
          }}
        >
          <S.Vector isMemo={isMemo}>
            <VectorIcon />
          </S.Vector>
          메모
        </S.TitleRight>
      </S.Title>
      {isMemo && <MemoBox color={roleColorPick.light} patientId={data.patientSimple.patientId} />}
      <S.Bottom>
        <S.TxtBox color={roleColorPick.light}>
          <S.TxtBoxLeft>{data.content}</S.TxtBoxLeft>
          <S.TxtBoxRight>{getPrevTimes(data.createdAt)}</S.TxtBoxRight>
        </S.TxtBox>
        <S.Dot onClick={onOptionOnOff}>
          <MoreHorizRoundedIcon />
          {isOptions && (
            <S.Options>
              {isAccept ? (
                <S.Option onClick={el => onCancelAccept(el)}>요청 수락 취소하기</S.Option>
              ) : (
                <S.Option
                  onMouseDown={e => {
                    e.stopPropagation(), setIsEdit(true);
                  }}
                >
                  담당직종 변경
                </S.Option>
              )}
              <S.Option onMouseDown={() => mutateDischargeByWeb(data.tabletSimple.tabletId)}>
                퇴원 처리하기
              </S.Option>
            </S.Options>
          )}
          {isEdit && (
            <S.Options tabIndex={0}>
              <span>담당직종 변경</span>
              {/* <BoxWrapper>
                <CComboBox
                  placeholder={"직종 선택"}
                  options={["간호사", "의사", "조무사", "직원"]}
                  value={OPTIONS.find(el => el.role === data.aiRole)?.value || "정의되지 않음"}
                  onChange={el => onChangePatientRole(el.target.value)}
                />
              </BoxWrapper> */}
            </S.Options>
          )}
        </S.Dot>
        <S.Check
          color={roleColorPick.dark}
          onClick={e => onMutates(e, data.patientRequestId, isAccept ? "accept" : "wait")}
        >
          {isAccept ? <CheckIcon /> : <ArrowForwardRoundedIcon style={{ color: "white" }} />}
        </S.Check>
      </S.Bottom>
      {isAccept && data.patientRequestId === roomId && (
        <ChatWrapper color={roleColorPick.light}>
          <ChatContainer id="top">
            {messages.map((el, idx) => (
              <ChatBox
                key={idx}
                data={el}
                color={roleColorPick.normal}
                darkColor={roleColorPick.dark}
              />
            ))}
          </ChatContainer>
          <ChatInput
            roomId={roomId}
            Icon={roleColorPick.sendIcon}
            setRoomId={setRoomId!}
            color={roleColorPick.dark}
          />
        </ChatWrapper>
      )}
    </S.InnerContainer>
  );
}
export default StaffPatientListBox;

const ChatWrapper = styled("div")<{ color: string }>`
  background-color: ${({ color }) => color};
  margin-top: 8px;
  border-radius: 12px;
`;
const ChatContainer = styled("div")`
  border-top: 1px solid ${({ theme }) => theme.palette.primary.contrastText};
  width: 100%;
  max-height: 300px;
  overflow: auto;
  border-radius: 12px 12px 0 0;
  margin-bottom: 10px;
  padding: 0 7px;
`;
