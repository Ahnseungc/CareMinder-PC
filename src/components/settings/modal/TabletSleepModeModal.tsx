import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { ReactComponent as X } from "@/assets/x-Icon.svg";
import { TimePicker } from "@mui/x-date-pickers";
import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

const OPTION_COLORS = {
  "강제종료": "#ff5733",
  "요청만 가능": "#9c27b0",
  "전체가능": "#4caf50",
} as const;

export default function TabletSleepModeModal({ onClose, ...props }: CMModalProps) {
  const LIMIT_OPTIONS = ["강제종료", "요청만 가능", "전체가능"];
  const selectRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectOption, setSelectOption] = useState<string>(LIMIT_OPTIONS[2]);

  const handleChangeOption = (option: string) => {
    setSelectOption(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <CMModal
      maxWidth="sm"
      title={"수면 모드 설정"}
      onClose={onClose}
      footer={
        <div style={{ marginBottom: "20px", display: "flex", gap: "24px" }}>
          <ModalActionButton color="secondary" onClick={onClose}>
            취소
          </ModalActionButton>
          <ModalActionButton onClick={() => null}>저장</ModalActionButton>
        </div>
      }
      {...props}
    >
      <X
        style={{ position: "absolute", right: "24px", top: "28px", cursor: "pointer" }}
        onClick={onClose}
      />
      <ContentWrapper>
        <p style={{ textDecoration: "underline" }}>기능 설명</p>
        <p style={{ fontSize: "18px", color: "#5E5F65" }}>
          현재 입원중인 모든 환자들에게 공통으로 적용됩니다.
        </p>
        <div style={{ borderBottom: "1px solid #5D6DBE", padding: "0 8px 4px 8px" }}>
          <span style={{ color: "black", fontSize: "14px", fontWeight: "600" }}>시간 설정</span>
        </div>
        <TimeSettingWraaper>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ color: "black", fontSize: "16px", fontWeight: "500" }}>시작 시간</p>
            <TimePicker
              sx={{
                width: "140px",
              }}
              timeSteps={{ hours: 1, minutes: 1, seconds: 5 }}
              defaultValue={dayjs("2022-04-17T20:00")}
              disabled={selectOption === "전체가능"}
            />
          </div>
          <span
            style={{
              position: "absolute",
              top: "70px",
              left: "228px",
              color: "black",
              fontWeight: "600",
            }}
          >
            ~
          </span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ color: "black", fontSize: "16px", fontWeight: "500" }}>종료 시간</p>
            <TimePicker
              sx={{ width: "140px" }}
              timeSteps={{ hours: 1, minutes: 1, seconds: 5 }}
              defaultValue={dayjs("2022-04-18T08:00")}
              disabled={selectOption === "전체가능"}
            />
          </div>
        </TimeSettingWraaper>
        <div>
          <p>제한 설정</p>
          <LimitSelect option={selectOption} onClick={() => setIsOpen(prev => !prev)}>
            {selectOption}
          </LimitSelect>
          {isOpen && (
            <LimitSelectOption ref={selectRef}>
              <ul>
                {LIMIT_OPTIONS.map((option, index) => (
                  <li
                    key={index}
                    style={{ fontWeight: `${option === selectOption ? "700" : "400"}` }}
                    onClick={() => handleChangeOption(option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </LimitSelectOption>
          )}
        </div>
      </ContentWrapper>
    </CMModal>
  );
}

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 30px;
`;

const TimeSettingWraaper = styled.div`
  display: flex;
  justify-content: center;
  gap: 43px;
  position: relative;
  border-bottom: 1px solid #c4c5cc;
  padding-bottom: 24px;
  width: 460px;
`;

interface LimitSelectProps {
  option: string;
}

const LimitSelect = styled.div<LimitSelectProps>`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  width: 144px;
  height: 40px;

  color: black;
  font-size: 16px;
  font-weight: 600;
  border: 1px solid #ececec;
  border-radius: 8px;
  padding: 8px 16px;

  &::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => OPTION_COLORS[props.option as keyof typeof OPTION_COLORS]};
  }

  &:hover {
    background-color: #5d6dbe11;
  }
`;

const LimitSelectOption = styled.div`
  position: absolute;
  bottom: 5px;
  left: 250px;
  z-index: 9999;
  width: 144px;
  border: 1px solid #ececec;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 8px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  ul {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 500;
      padding: 8px 16px;
      cursor: pointer;
      color: black;

      &:hover {
        background-color: #5d6dbe1a;
      }

      &::before {
        content: "";
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }

      &:nth-of-type(1)::before {
        background-color: #ff5733;
      }

      &:nth-of-type(2)::before {
        background-color: #9c27b0;
      }

      &:nth-of-type(3)::before {
        background-color: #4caf50;
      }
    }
  }
`;
