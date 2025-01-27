import { useState } from "react";
import { ReactComponent as MoreHorizRoundedIcon } from "@/assets/homeIcons/Dot.svg";
import { ReactComponent as VectorIcon } from "@/assets/homeIcons/Dark_Vector.svg";

import { StaffGroupListBoxProps } from "@models/home";
import MemoBox from "../MemoBox/MemoBox";

import getPrevTimes from "@utils/getPrevTimes";
import { roleColor } from "@utils/homePage";

import * as S from "../Style/listBox.style";

function CompletedPatientListBox({ data, onMutates, roomId }: StaffGroupListBoxProps) {
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
    <S.InnerContainer color={roleColorPick.light}>
      <S.LeftLine color={roleColorPick.dark}></S.LeftLine>
      <S.Title color={roleColorPick.dark} tabIndex={0} onBlur={() => setIsOptions(false)}>
        <div>
          <div>
            {data.areaSimple?.areaName} ({data.tabletSimple?.tabletName})
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
        <S.Dot onClick={onOptionOnOff} color={roleColorPick.dark}>
          <MoreHorizRoundedIcon />
          {isOptions && (
            <S.Options>
              <S.Option onClick={e => onMutates(e, data.patientRequestId, "accept")}>
                복원하기
              </S.Option>

              <S.Option onClick={e => onMutates(e, data.tabletSimple.tabletId, "discharge")}>
                퇴원 처리하기
              </S.Option>
            </S.Options>
          )}
        </S.Dot>
      </S.Bottom>
    </S.InnerContainer>
  );
}
export default CompletedPatientListBox;
