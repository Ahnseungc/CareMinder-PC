import { styled } from "@mui/material";
import { useEffect, useState } from "react";
// import { ReactComponent as PersonIcon } from "@/assets/completedRequests/person.svg";
import PatientBox from "@components/common/patientListBox";
import { RequestsData } from "@models/home";
import useGetCompleted from "@hooks/queries/useGetCompleted";
import useGetCompletedGroup from "@hooks/queries/useGetCompletedGroup";
import useCompleteAccept from "@hooks/mutation/useCompleteAccept";
import useCompleteDischargeByWeb from "@hooks/mutation/useCompleteDischargeByWeb";
import { useSetRecoilState } from "recoil";
import { layoutState } from "@libraries/recoil";
import * as S from "../../pages/user/Style/wardAndStaff.style";
import { bottomScroll, roleColor } from "@utils/homePage";
import { LoadChatHistory } from "@components/chat/chattingModel";
import { Message } from "@models/staff";
import ChatBox from "@components/chat/chatBox";
import CompletedGroupList from "@components/common/patientListBox/completedRequest/CompletedGroupList";
// import StaffSearchBox from "@components/common/SearachBox/StaffSearchBox";

export default function CompletedRequestsPage() {
  const setlayoutState = useSetRecoilState(layoutState);

  const [isGroup, setIsGroup] = useState<boolean>(false);
  const [isFocusPatientData, setIsFocusPatientData] = useState<null | RequestsData>();
  const [isRoomId, setRoomId] = useState<null | number>(null);

  const [myArea, setMyArea] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const { data: getCompleted, refetch: refetchComplete } = useGetCompleted(myArea, isGroup);
  const { data: getCompletedGroup, refetch: refetchCompletedGroup } = useGetCompletedGroup(
    myArea,
    isGroup,
  );
  const refetchProps = {
    refetchComplete,
    refetchCompletedGroup,
    isGroup,
  };
  const { mutate: mutateAccept } = useCompleteAccept(refetchProps);
  const { mutate: mutateDischarge } = useCompleteDischargeByWeb(refetchProps);

  const onMutates = (e: React.MouseEvent, id: number, type: string) => {
    e.stopPropagation();
    if (type === "accept") {
      mutateAccept(id);
    }
    if (type === "discharge") {
      mutateDischarge(id);
    }
    setIsFocusPatientData(undefined);
  };

  const getHistoryChatting = async () => {
    const history = await LoadChatHistory(isRoomId!);
    setMessages(history);
    bottomScroll();
  };

  useEffect(() => {
    setlayoutState("home");
  }, []);

  useEffect(() => {
    if (isFocusPatientData) {
      getHistoryChatting();
    }
  }, [isFocusPatientData]);

  console.log(isFocusPatientData);

  const roleColorPick = roleColor(
    isFocusPatientData === undefined || null ? "NURSE" : isFocusPatientData!.aiRole,
  );

  return (
    <>
      <LeftSection>
        <S.TitleWrapper>
          <S.Title>완료 요청 히스토리</S.Title>
          <S.SearchBoxWrapper>{/* <StaffSearchBox /> */}</S.SearchBoxWrapper>
        </S.TitleWrapper>
        <S.SubTitle>
          <S.SubTitleLeft>
            <div>필터</div>
            <S.FilterBox isTrue={isGroup} onClick={() => setIsGroup(prev => !prev)}>
              환자별
            </S.FilterBox>
            <S.FilterBox isTrue={myArea} onClick={() => setMyArea(prev => !prev)}>
              구역
            </S.FilterBox>
            <S.FilterBox isTrue={false}>직종</S.FilterBox>
          </S.SubTitleLeft>
        </S.SubTitle>
        {!isGroup &&
          getCompleted?.map(el => (
            <div
              key={el.patientRequestId}
              onClick={() => {
                setIsFocusPatientData(el), setRoomId(el.patientRequestId);
              }}
            >
              <PatientBox
                key={el.patientRequestId}
                user="completedRequest"
                data={el}
                roomId={isFocusPatientData?.patientRequestId}
                setRoomId={setRoomId}
                onMutates={onMutates}
              />
            </div>
          ))}
        {isGroup &&
          getCompletedGroup?.map(el => (
            <CompletedGroupList
              key={el.patientSimple.patientId}
              data={el}
              onMutates={onMutates}
              roomId={1}
              setRoomId={() => {
                return;
              }}
            />
          ))}
      </LeftSection>

      <RightSection color={isFocusPatientData ? roleColorPick.light : "white"}>
        {isFocusPatientData && (
          <>
            <S.TitleWrapper>
              <Title color={roleColorPick.dark}>
                {isFocusPatientData.areaSimple?.areaName} (
                {isFocusPatientData.tabletSimple?.tabletName})<span> | </span>
                <span>{isFocusPatientData.patientSimple.patientName}</span>
              </Title>
              <S.SearchBoxWrapper>{/* <StaffSearchBox /> */}</S.SearchBoxWrapper>
            </S.TitleWrapper>

            <ChatWrapper>
              <ChatContainer id="top" color={roleColorPick.dark}>
                {messages.map((el, idx) => (
                  <ChatBox key={idx} data={el} color={roleColorPick.normal} />
                ))}
              </ChatContainer>
            </ChatWrapper>
            <RestoreWrapper>
              <Restore
                color={roleColorPick.dark}
                onClick={e => onMutates(e, isFocusPatientData!.patientRequestId, "accept")}
              >
                요청 복원하기
              </Restore>

              <InputWrapper>
                <Input
                  type="text"
                  placeholder="현재는 메세지를 입력할 수 없습니다 / 이미 처리 완료된 채팅입니다."
                  disabled={true}
                />
                <SendButton></SendButton>
              </InputWrapper>
            </RestoreWrapper>
          </>
        )}
      </RightSection>
    </>
  );
}

const LeftSection = styled(S.SectionBase)({
  // 왼쪽 컨테이너에 스타일 적용
});

export const RightSection = styled(S.SectionBase)<{ color: string }>`
  background-color: ${({ color }) => color};
  position: relative;
  max-height: 88vh;
  box-shadow: ${({ color }) =>
    color !== "white" ? "rgba(0, 0, 0, 0.18) 0px -200px 36px -28px inset" : "none"};
`;

const ChatWrapper = styled("div")`
  height: 63vh;
`;

const Title = styled("div")<{ color: string }>`
  font-size: 20px;
  color: ${({ color }) => color};
  font-weight: 700;
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
const Restore = styled("div")<{ color: string }>`
  background-color: ${({ color }) => color};
  text-align: center;
  padding: 6px 0;
  border-radius: 6px;
  width: 98px;
  font-weight: 600;
  cursor: pointer;
`;
const RestoreWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 26px;
`;
const InputWrapper = styled("div")`
  margin-top: 26px;
  width: 100%;
  background-color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
`;
const ChatContainer = styled("div")<{ color: string }>`
  border-top: 1px solid ${({ theme }) => theme.palette.primary.contrastText};
  margin-top: 12px;
  /* max-height: 600px; */
  max-height: 60vh;
  height: 100%;
  overflow: auto;
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ color }) => color};
    border-radius: 8px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(220, 20, 60, 0.1);
  }
`;
