import { Stack, styled } from "@mui/material";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { roleColor } from "@utils/homePage";
import { useState } from "react";
import { StaffGroupListBoxProps } from "@models/home";
import getPrevTimes from "@utils/getPrevTimes";

import { ReactComponent as VectorIcon } from "@/assets/homeIcons/Dark_Vector.svg";
import MemoBox from "../MemoBox/MemoBox";

function CompletedPatientListBox({ data, onMutates, roomId, setRoomId }: StaffGroupListBoxProps) {
  const roleColorPick = roleColor(data.aiRole);

  const [isOptions, setIsOptions] = useState(false);
  const [isMemo, setIsMemo] = useState(false);

  const onOptionOnOff = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOptions) {
      setIsOptions(false);
    } else if (!isOptions) {
      setIsOptions(true);
    }
  };

  return (
    <InnerContainer color={roleColorPick.light}>
      <LeftLine color={roleColorPick.dark}></LeftLine>
      <Title color={roleColorPick.dark} tabIndex={0} onBlur={() => setIsOptions(false)}>
        <div>
          <div>
            {data.areaSimple?.areaName} ({data.tabletSimple?.tabletName})
          </div>
          <span> | </span>
          <div>{data.patientSimple.patientName}</div>
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
      {isMemo && <MemoBox color={roleColorPick.light} patientId={data.patientSimple.patientId} />}

      <Bottom>
        <TxtBox color={roleColorPick.light}>
          <TxtBoxLeft>{data.content}</TxtBoxLeft>
          <TxtBoxRight>{getPrevTimes(data.createdAt)}</TxtBoxRight>
        </TxtBox>
        <Dot onClick={onOptionOnOff} color={roleColorPick.dark}>
          <MoreHorizRoundedIcon />
          {isOptions && (
            <Options>
              <Option onClick={e => onMutates(e, data.patientRequestId, "accept")}>복원하기</Option>

              <Option onClick={e => onMutates(e, data.tabletSimple.tabletId, "discharge")}>
                퇴원 처리하기
              </Option>
            </Options>
          )}
        </Dot>
      </Bottom>
    </InnerContainer>
  );
}
export default CompletedPatientListBox;

const InnerContainer = styled(Stack)<{ color: string }>`
  position: relative;
  width: 100%;
  padding: 0 13px;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
`;
const LeftLine = styled("div")<{ color: string }>`
  width: 4px;
  height: 100%;
  border-radius: 4px;
  background-color: ${({ color }) => color};
  position: absolute;
  left: 0;
`;
const Title = styled("div")<{ color: string }>`
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
const TxtBox = styled("div")<{ color: string }>`
  border-radius: 6px;
  width: 100%;
  border: 3px solid ${({ color }) => color};
  padding: 6px 16px 6px 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.palette.primary.dark};
  display: flex;
  justify-content: space-between;
`;
const TxtBoxLeft = styled("div")`
  display: flex;
  align-items: center;
`;
const Vector = styled("div")<{ isMemo: boolean }>`
  transform: ${({ isMemo }) => isMemo && "rotate(-90deg)"};
  margin-right: 8px;
`;
const TxtBoxRight = styled("div")`
  color: ${({ theme }) => theme.palette.text.primary};
  min-width: 60px;
  text-align: end;
`;
const Bottom = styled("div")`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const Dot = styled("div")<{ color: string }>`
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: flex;
  margin-left: 6px;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
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
  z-index: 100;
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
