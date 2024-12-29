import React, { FC, SetStateAction, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import styled from "@emotion/styled";
import CCheckBox from "../C-CheckBox";
import { ReactComponent as LeftArrow } from "@assets/calendar/calendar-left-arrow.svg";
import { ReactComponent as RightArrow } from "@assets/calendar/calendar-right-arrow.svg";

type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];

interface MyCalendarProps {
  value: Value;
  setState: React.Dispatch<SetStateAction<Value>>;
}

const MyCalendar: FC<MyCalendarProps> = ({ value, setState }) => {
  const [unspecified, setUnspecified] = useState(false);

  const handleUnspecified = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setUnspecified(prev => !prev);
  };

  return (
    <StyledCalendarWrapper
      unspecified={unspecified}
      onClick={e => {
        e.stopPropagation();
      }}
    >
      <StyledCalendarHeader>
        <CCheckBox onChange={handleUnspecified} checked={unspecified} />
        <p>퇴원 일자 미지정</p>
      </StyledCalendarHeader>
      <Calendar
        onChange={setState}
        value={value}
        view="month"
        minDetail="month"
        //@ts-ignore
        formatDay={(locale, date) => {
          return moment(date).format("D");
        }}
        nextLabel={<RightArrow />}
        prevLabel={<LeftArrow />}
        next2Label={null}
        prev2Label={null}
      />
    </StyledCalendarWrapper>
  );
};

export default MyCalendar;

export const StyledCalendarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 24px;

  & p {
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: -3%;
    color: #5e5f65;
  }
`;

export const StyledCalendarWrapper = styled.div<{ unspecified: boolean }>`
  position: absolute;
  z-index: 1000;
  right: -5vw;
  top: 4vh;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(137, 137, 142, 0.3);
  border-radius: 8px;
  border: none;
  width: 254px;
  padding-top: 12px;
  height: fit-content;
  padding-bottom: 20px;
  padding-left: 12px;
  padding-right: 12px;
  padding-bottom: 20px;
  .react-calendar {
    opacity: ${props => (props.unspecified ? 0.3 : 1)};
    background-color: #ffffff;
    border-radius: 8px;
    border: none;
    width: 100%;
    height: fit-content;
    pointer-events: ${props => (props.unspecified ? "none" : "auto")};
  }

  /* 년-월 타이틀 */
  .react-calendar__navigation__label > span {
    color: #000000;
    font-size: 13px;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: -3%;
    margin-bottom: 0; /* 년-월 타이틀 아래 간격 제거 */
  }

  /* 년-월 네비게이션 버튼 사이 간격 없애기 */
  .react-calendar__navigation button {
    margin: 0; /* 버튼 간격 없애기 */
    padding: 0; /* 버튼 내부 패딩 없애기 */
    &:disabled {
      background-color: #ffffff;
    }
  }
  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: transparent !important; /* 배경 색을 투명하게 설정 */
    box-shadow: none !important; /* 필요시 그림자도 제거 */
    color: inherit !important; /* 텍스트 색상도 기본 값으로 */
    border: none !important; /* 테두리 제거 */
  }
  .react-calendar__month-view__weekdays__weekday abbr {
    text-decoration: none;
  }

  /* 년-월 타이틀과 요일 사이 간격 없애기 */
  .react-calendar__navigation {
    margin-bottom: 0; /* 네비게이션과 요일 사이의 간격 제거 */
    padding-bottom: 0; /* 네비게이션과 요일 사이의 간격 제거 */
  }

  /* 요일 */
  .react-calendar__month-view__weekdays__weekday {
    color: #5e5f6599;
    opacity: 60%;
    font-size: 11px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: -3%;
    border-bottom: 1px solid #ececec;
  }

  /* 요일과 날짜 타일 간의 간격 없애기 */
  .react-calendar__month-view__weekdays {
    margin-bottom: 9.88px; /* 요일과 날짜 타일 사이의 마진 제거 */
    padding-bottom: 0 !important; /* 요일과 날짜 타일 사이의 패딩 제거 */
  }

  /* 날짜 타일 */
  .react-calendar__tile {
    color: #5e5f65;
    font-size: 12px;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25.5px !important;
    /* max-width: 25.5px !important; */
    height: 32.85px !important;
    padding: 6px !important;
  }

  /* 저번 달 & 다음 달 날짜 */
  .react-calendar__month-view__days__day--neighboringMonth {
    color: #c4c5cc;
    font-size: 12px;
    line-height: 20px;
    font-weight: 500;
    width: 25.5px;
    height: 25.5px;
  }

  /* 오늘 날짜 */
  .react-calendar__tile--now {
    background-color: #fff;
    /* color: #fff; */
    /* font-size: 12px;
    line-height: 20px;
    font-weight: 500;
    border-radius: 100%;
    width: 25.5px;
    height: 25.5px; */
  }

  /* 선택된 날짜의 배경색 변경 */
  .react-calendar__tile--active {
    background-color: #30b4ff;
    color: #fff;
    font-size: 12px;
    line-height: 20px;
    font-weight: 500;
    border-radius: 100%;
    width: 25.5px;
    height: 25.5px;
  }

  .react-calendar__tile--hasActive {
    background: #30b4ff;
  }

  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: #30b4ff;
  }
`;
