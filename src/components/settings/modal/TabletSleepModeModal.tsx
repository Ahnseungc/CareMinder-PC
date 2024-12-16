import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { ReactComponent as X } from "@/assets/x-Icon.svg";
import { TimePicker } from "@mui/x-date-pickers";
import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

const OPTION_COLORS = {
  "강제종료": "#ff4a4a",
  "요청만 가능": "#b66ef1",
  "전체가능": "#04b300",
} as const;

export default function TabletSleepModeModal({ onClose, ...props }: CMModalProps) {
  const LIMIT_OPTIONS = ["강제종료", "요청만 가능", "전체가능"];
  const selectRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDescOpen, setIsDescOpen] = useState<boolean>(false);
  const [selectOption, setSelectOption] = useState<string>(LIMIT_OPTIONS[2]);

  const handleChangeOption = (option: string) => {
    setSelectOption(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const limitSelectElement = document.querySelector('[data-select="limit"]');
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        !limitSelectElement?.contains(event.target as Node)
      ) {
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
        <FuncDescText onClick={() => setIsDescOpen(prev => !prev)} isOpen={isDescOpen}>
          기능 설명
        </FuncDescText>
        {isDescOpen && (
          <FuncDescContent>
            <div>수면 모드는 환자들의 수면 시간을 고려하여 기능을 제한하는 설정입니다.</div>
            <div>모드는 다음과 같이 세 가지 옵션이 있습니다:</div>
            <br />
            <div>
              1.<span>강제 종료</span>:태블릿의 모든 기능이 차단되어 사용하실 수 없습니다.
            </div>
            <div>
              2.<span>요청만 가능</span>:유튜브와 같은 앱은 사용하실 수 없지만,
              <br /> 음성 요청이나 빠른 요청 같은 기본적인 요청은 가능합니다.
            </div>
            <div>
              3.<span>전체 가능</span>:모든 기능을 자유롭게 사용하실 수 있습니다.
              <br /> 이 경우 수면 모드가 적용되지 않으며, 별도의 시간 설정이 필요하지 않습니다.
            </div>
            <br />
            <div>모드를 선택하신 후 시작시간과 종료시간을 입력해 주세요.</div>
            <div>
              예를 들어 07:00 AM 부터 02:00 AM까지 설정하시면,
              <br /> 그날 아침부터 다음날 새벽까지 해당 모드가 자동으로 적용됩니다.
            </div>
          </FuncDescContent>
        )}
        <InfoText>현재 입원중인 모든 환자들에게 공통으로 적용됩니다.</InfoText>
        <SettingText>
          <span>시간 설정</span>
        </SettingText>
        <TimeSettingWraaper>
          <TimePickerWrapper>
            <p>시작 시간</p>
            <TimePicker
              sx={{
                width: "140px",
              }}
              timeSteps={{ hours: 1, minutes: 1, seconds: 5 }}
              defaultValue={dayjs("2024-12-15T20:00")}
              disabled={selectOption === "전체가능"}
            />
          </TimePickerWrapper>
          <Wave>~</Wave>
          <TimePickerWrapper>
            <p>종료 시간</p>
            <TimePicker
              sx={{ width: "140px" }}
              timeSteps={{ hours: 1, minutes: 1, seconds: 5 }}
              defaultValue={dayjs("2024-12-15T08:00")}
              disabled={selectOption === "전체가능"}
            />
          </TimePickerWrapper>
        </TimeSettingWraaper>

        <SettingText>
          <span>제한 설정</span>
        </SettingText>
        <LimitSelect
          option={selectOption}
          data-select="limit"
          onClick={() => setIsOpen(prev => !prev)}
        >
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

const FuncDescText = styled.p<{ isOpen: boolean }>`
  position: relative;
  cursor: pointer;
  text-decoration: underline;
  color: ${(props: { isOpen: boolean }) => (props.isOpen ? "#5D6DBEcc" : " #21262bcc")};
  &:hover {
    color: #5d6dbecc;
  }
`;

const FuncDescContent = styled.div`
  position: absolute;
  z-index: 100;
  width: 531px;
  padding: 16px;
  background-color: #21262bcc;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;

  span {
    font-weight: 600;
  }

  div:nth-child(4) span {
    color: #ff4a4a;
  }

  div:nth-child(5) span {
    color: #b66ef1;
  }

  div:nth-child(6) span {
    color: #04b300;
  }
`;

const InfoText = styled.p`
  font-size: 18px;
  color: #5e5f65;
`;

const TimePickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  p {
    color: black;
    font-size: 16px;
    font-weight: 500;
  }
`;

const Wave = styled.span`
  position: absolute;
  top: 70px;
  left: 228px;
  color: black;
  font-weight: 600;
`;

const TimeSettingWraaper = styled.div`
  display: flex;
  justify-content: center;
  gap: 43px;
  position: relative;
  border-bottom: 1px solid #c4c5cc;
  padding-bottom: 24px;
  margin-bottom: 24px;
  width: 460px;
`;

const SettingText = styled.div`
  border-bottom: 1px solid #5d6dbe;
  padding: 0 8px 4px 8px;
  span {
    color: black;
    font-size: 14px;
    font-weight: 600;
  }
`;

const LimitSelect = styled.div<{ option: string }>`
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
  margin-top: 10px;

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
