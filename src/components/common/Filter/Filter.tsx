import styled from "@emotion/styled";
import { Autocomplete, Checkbox, Paper, TextField } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import palette from "@styles/palette";
import CButton from "../atom/C-Button";
import { useState, useEffect, useRef } from "react";
import { ReactComponent as X } from "@assets/x-Icon.svg";
import { Order } from "@hooks/mutation/useTabletList";
import qs from "qs";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface CFilterProps {
  options: string[];
  type: "ADMIN" | "WARD" | "STAFF";
  onApply: (selected: string[], orderType: Order) => void;
  prevFilter: string[];
}

export default function CFilter({ options, type, onApply, prevFilter }: CFilterProps) {
  const [selectFilter, setSelectFilter] = useState<string[]>(prevFilter);
  const [currentOrder, setCurrentOrder] = useState<"오름차순" | "내림차순">("오름차순");
  const [containerHeight, setContainerHeight] = useState<number>(308);
  const inputRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const typeColors = {
    ADMIN: {
      background: "#F1F9F9",
      chip: "#A6D7DC",
      selectedBg: "#E5F5F5",
    },
    WARD: {
      background: palette.success.main,
      chip: "#B4C0FF",
      selectedBg: "#F5F7FF",
    },
    STAFF: {
      background: "#EAF7FF",
      chip: "#8ED5FF",
      selectedBg: "#F0F9FF",
    },
  };

  useEffect(() => {
    const calculateHeight = () => {
      if (inputRef.current && listboxRef.current) {
        const inputHeight = inputRef.current.offsetHeight;

        const listboxHeight = Math.min(options.length * 40, 144) + 40;
        const buttonHeight = 40;
        const padding = 16;

        const newHeight = inputHeight + listboxHeight + buttonHeight + padding;
        setContainerHeight(newHeight);
      }
    };

    calculateHeight();

    const resizeObserver = new ResizeObserver(calculateHeight);
    if (inputRef.current) {
      resizeObserver.observe(inputRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [options.length, selectFilter]);

  const handleSelectionChange = (_: React.SyntheticEvent, newValue: string[]) => {
    setSelectFilter(newValue);
  };

  const handleSelectAll = () => {
    if (selectFilter.length === options.length) {
      setSelectFilter([]);
    } else {
      setSelectFilter([...options]);
    }
  };

  const CustomListboxWithSelectAll = (props: React.HTMLAttributes<HTMLElement>) => {
    const { children, ...other } = props;
    return (
      <CustomListbox ref={listboxRef} {...other}>
        <li
          style={{
            paddingTop: "8px",
            paddingBottom: "8px",
            paddingLeft: "16px",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
          onClick={handleSelectAll}
        >
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            checked={selectFilter.length === options.length}
            onChange={handleSelectAll}
            sx={{
              "marginRight": "8px",
              "cursor": "pointer",
              "& .MuiSvgIcon-root": {
                color: typeColors[type].chip,
              },
            }}
          />
          <span style={{ fontSize: "14px" }}>모두 선택</span>
        </li>
        {children}
      </CustomListbox>
    );
  };

  useEffect(() => {
    const query = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });

    if (query.areaSort) {
      setCurrentOrder(query.areaSort === "ASC" ? "오름차순" : "내림차순");
    } else {
      setCurrentOrder("오름차순");
    }
  }, []);

  return (
    <FilterContainer $height={containerHeight}>
      <Autocomplete
        multiple
        id="C-filter"
        open
        options={options}
        disableCloseOnSelect
        value={selectFilter}
        onChange={handleSelectionChange}
        PaperComponent={({ children }) => <Paper elevation={0}>{children}</Paper>}
        slotProps={{
          popper: {
            sx: {
              zIndex: 130,
            },
          },
        }}
        sx={{
          "width": "240px",
          ".MuiInputBase-root": {
            backgroundColor: typeColors[type].background,
            borderRadius: "8px",
            border: `1px solid ${typeColors[type].background}`,
          },
          "&&& .MuiOutlinedInput-root": {
            paddingRight: "8px",
          },
          ".MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          ".MuiAutocomplete-tag": {
            "backgroundColor": typeColors[type].chip,
            "color": "#1F1F1F",
            "borderRadius": "2px",
            "& .MuiChip-label": {
              padding: "3px 8px",
            },
          },
        }}
        ChipProps={{
          deleteIcon: (
            <span style={{ color: "#1f1f1f" }}>
              <X />
            </span>
          ),
        }}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props as any;
          return (
            <li
              key={key}
              {...optionProps}
              style={{
                paddingTop: "8px",
                paddingBottom: "8px",
                backgroundColor: selected ? typeColors[type].selectedBg : "transparent",
              }}
            >
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                sx={{
                  "marginRight": "8px",
                  "& .MuiSvgIcon-root": {
                    color: typeColors[type].chip,
                  },
                }}
                checked={selected}
              />
              {option}
            </li>
          );
        }}
        renderInput={params => (
          <div ref={inputRef} style={{ position: "relative" }}>
            <TextField
              {...params}
              sx={{
                "width": 241,
                ".MuiAutocomplete-endAdornment": {
                  display: "none",
                },
              }}
              placeholder={selectFilter.length === 0 ? "선택된 항목이 없습니다." : ""}
            />
          </div>
        )}
        ListboxComponent={CustomListboxWithSelectAll}
        ListboxProps={{
          style: {
            overflowY: "scroll",
            padding: 0,
            maxHeight: "184px",
          },
        }}
      />
      <ButtonContainer>
        <CButton
          buttontype={
            currentOrder === "오름차순"
              ? `${type === "ADMIN" ? "primarySquareWhiteAdmin" : type === "WARD" ? "primarySpaureWhite" : "primarySquareWhiteStaff"}`
              : "primarySquareWhiteSecond"
          }
          onClick={() => {
            onApply(selectFilter, "ASC");
            setCurrentOrder("오름차순");
          }}
          sx={{ borderRadius: "999px" }}
        >
          오름차순
        </CButton>
        <CButton
          buttontype={
            currentOrder === "내림차순"
              ? `${type === "ADMIN" ? "primarySquareWhiteAdmin" : type === "WARD" ? "primarySpaureWhite" : "primarySquareWhiteStaff"}`
              : "primarySquareWhiteSecond"
          }
          onClick={() => {
            onApply(selectFilter, "DESC");
            setCurrentOrder("내림차순");
          }}
          sx={{ borderRadius: "999px" }}
        >
          내림차순
        </CButton>
      </ButtonContainer>
    </FilterContainer>
  );
}

/** styles */
const FilterContainer = styled.div<{ $height: number }>`
  position: relative;
  width: auto;
  height: calc(${props => props.$height}px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 8px;
  background-color: ${palette.primary.contrastText};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: height 0.3s ease;
`;

const CustomListbox = styled.ul`
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${palette.primary.contrastText};
    border-radius: 100px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${palette.primary.dark}1a;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 12px;
  width: 90%;
  display: flex;
  gap: 4px;
`;
