import { Stack, styled } from "@mui/material";
import { roleColor } from "@utils/homePage";
import { useState } from "react";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";

import { patientMapType } from "@models/staff";
import getPrevTimes from "@utils/getPrevTimes";
import { StaffGroupListBoxProps, isRoleType } from "@models/index";
import { ReactComponent as VectorIcon } from "@/assets/homeIcons/Dark_Vector.svg";
import MemoBox from "../MemoBox/MemoBox";

function CompletedGroupList({ data, onMutates, roomId, setRoomId }: StaffGroupListBoxProps) {
  const [focusRole, setFocusRole] = useState<Exclude<isRoleType, null>>("NURSE");

  const [isMemo, setIsMemo] = useState<boolean>(false);

  const [isFullList, setIsFullList] = useState(false);

  return (
    <InnerContainer>
      <Title tabIndex={0}>
        <div>
          <div>
            {data?.patientRequests[0]?.areaSimple?.areaName} ({data?.tabletSimple?.tabletName})
          </div>
          <span> | </span>
          <div>{data?.patientSimple?.patientName}</div>
        </div>
        <TitleRight
          onClick={e => {
            e.stopPropagation(), setIsMemo(prev => !prev);
          }}
        >
          <Vector isMemo={isMemo}>
            <VectorIcon />
          </Vector>
          메모
        </TitleRight>
      </Title>
      {isMemo && <MemoBox color={"#EAF8EA"} patientId={data.patientSimple.patientId} />}

      <BottomWrapper isFullList={isFullList}>
        {data.patientRequests.map((el: patientMapType) => (
          <Bottom key={el.patientRequestId} color={roleColor(el.aiRole).dark}>
            <LeftLine color={roleColor(el.aiRole).dark}></LeftLine>

            <TxtBox
              color={roleColor(el.aiRole).dark}
              isFocus={el.patientRequestId === roomId}
              light={roleColor(el.aiRole).light}
            >
              <TxtBoxLeft>{el.content}</TxtBoxLeft>
              <TxtBoxRight>{getPrevTimes(el.createdAt)}</TxtBoxRight>
            </TxtBox>
            <Dot color={roleColor(el.aiRole).dark}>
              <MoreHorizRoundedIcon />
            </Dot>
          </Bottom>
        ))}
      </BottomWrapper>
      <IsTotalList onClick={() => setIsFullList(prev => !prev)}>
        {isFullList ? "닫기" : "요청 전체 보기"}
      </IsTotalList>
    </InnerContainer>
  );
}
export default CompletedGroupList;

const InnerContainer = styled(Stack)`
  border-radius: 12px;
  width: 100%;
  padding: 16px 0px;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`;

const Vector = styled("div")<{ isMemo: boolean }>`
  transform: ${({ isMemo }) => isMemo && "rotate(-90deg)"};
  margin-right: 8px;
`;
const Title = styled("div")`
  font-weight: 700;
  font-size: 16px;
  color: #000000;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  margin-right: 30px;
  & > div {
    display: flex;
  }
  & > div > span {
    margin: 0 5px;
  }
`;
const TitleRight = styled("div")`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.primary};
  cursor: pointer;
`;
const TxtBox = styled("div")<{ color: string; isFocus: boolean; light: string }>`
  border-radius: 6px;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.primary.contrastText};
  padding: 6px 16px 6px 16px;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.primary.dark};
  display: flex;
  justify-content: space-between;
  background-color: ${({ color, isFocus }) => isFocus && color};
  cursor: pointer;
  color: ${({ isFocus }) => isFocus && "white"};
  border: 3px solid ${({ light }) => light};
  & > div {
    color: ${({ isFocus }) => isFocus && "white"};
  }
`;
const TxtBoxLeft = styled("div")`
  display: flex;
  align-items: center;
  margin-left: 3px;
`;
const TxtBoxRight = styled("div")`
  color: ${({ theme }) => theme.palette.text.primary};
  min-width: 60px;
  text-align: end;
`;
const Bottom = styled("div")<{ color: string }>`
  display: flex;
  width: 100%;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 8px;
  position: relative;
  :hover {
    & > div {
      background-color: ${({ color }) => color};
      cursor: pointer;
      color: white;
      & > div {
        color: white;
      }
    }
    & > div:last-child {
      color: ${({ color }) => color};
      background-color: white;
    }
  }
`;
const Dot = styled("div")<{ color: string }>`
  color: ${({ color }) => color};
  cursor: pointer;
  margin-right: 5px;
  background-color: transparent;
  transform: rotate(90deg);
  margin-bottom: 2px;
`;

const BottomWrapper = styled("div")<{ isFullList: boolean }>`
  max-height: ${({ isFullList }) => !isFullList && "135px"};
  overflow: auto;
`;
const IsTotalList = styled("div")`
  color: #878787;
  font-size: 12px;
  padding: 12px 0;
  text-align: center;
  cursor: pointer;
`;

const LeftLine = styled("div")<{ color: string }>`
  width: 4px;
  height: 60%;
  bottom: 7px;
  border-radius: 4px;
  background-color: ${({ color }) => color};
  position: absolute;
  left: 10px;
`;
