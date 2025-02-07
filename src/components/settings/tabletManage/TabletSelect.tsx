import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ReactComponent as DownArrow } from "@assets/downarrow-middle-icon.svg";
import palette from "@styles/palette";

const OPTION_COLORS = {
  "강제종료": "#ff4a4a",
  "요청만 가능": "#b66ef1",
  "전체가능": "#04b300",
} as const;

interface TabletSelectProps {
  option: string[];
}

export default function TabletSelect({ option }: TabletSelectProps) {
  const [selectOption, setSelectOption] = useState<string>(option[option.length - 1]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleChangeOption = (option: string) => {
    setSelectOption(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isTabletStatus = option.length === 3;

  return (
    <LimitSelect
      ref={ref}
      option={selectOption}
      data-select="limit"
      onClick={() => setIsOpen(prev => !prev)}
    >
      {selectOption}
      <motion.span
        initial={{ rotate: 0 }}
        animate={{ rotate: isOpen ? "180deg" : 0 }}
        transition={{ duration: 0.25 }}
        style={{ position: "absolute", right: "10px" }}
      >
        <DownArrow />
      </motion.span>
      <LimitSelectOption
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: {
            opacity: 1,
            y: 0,
            display: "block",
            transition: { duration: 0.2 },
          },
          closed: {
            opacity: 0,
            y: -10,
            transition: { duration: 0.2 },
            transitionEnd: { display: "none" },
          },
        }}
      >
        <ul>
          {option.map((opt, index) => (
            <OptionItem
              key={index}
              isSelected={opt === selectOption}
              optionType={opt}
              isTabletStatus={isTabletStatus}
              onClick={e => {
                e.stopPropagation();
                handleChangeOption(opt);
              }}
            >
              {opt}
            </OptionItem>
          ))}
        </ul>
      </LimitSelectOption>
    </LimitSelect>
  );
}

interface OptionItemProps {
  isSelected: boolean;
  optionType: string;
  isTabletStatus: boolean;
}

const OptionItem = styled.li<OptionItemProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 400;
  padding: 8px 16px;
  cursor: pointer;
  color: black;
  background-color: ${props =>
    props.isSelected ? palette.success.main : palette.primary.contrastText};

  &:hover {
    background-color: #5d6dbe1a;
  }

  &::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => OPTION_COLORS[props.optionType as keyof typeof OPTION_COLORS]};
  }
`;

const LimitSelect = styled.div<{ option: string }>`
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  color: ${palette.text.dark};
  font-size: 16px;
  font-weight: 400;
  border: 1px solid #ececec;
  border-radius: 8px;
  padding: 8px 16px;
  margin-bottom: 20px;

  &::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => OPTION_COLORS[props.option as keyof typeof OPTION_COLORS]};
  }

  &:hover {
    background-color: ${palette.primary.main}11;
  }
`;

const LimitSelectOption = styled(motion.div)`
  position: absolute;
  top: 40px;
  left: 0;
  z-index: 99;
  width: 100%;
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
  }
`;
