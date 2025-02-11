import styled from "@emotion/styled";
import { Autocomplete, Checkbox, Paper, TextField } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import palette from "@styles/palette";
import CButton from "../atom/C-Button";
import { useState } from "react";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const options = ["간호사", "간호조무사", "의사", "직원", "간호사", "간호조무사", "의사", "직원"];

type Order = "오름차순" | "내림차순";

export default function CFilter() {
  const [selectFilter, setSelectFilter] = useState<string[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order>("오름차순");

  const handleSelectionChange = (_: React.SyntheticEvent, newValue: string[]) => {
    setSelectFilter(newValue);
  };

  return (
    <FilterContainer>
      <Autocomplete
        multiple
        id="C-filter"
        open
        options={options}
        disableCloseOnSelect
        value={selectFilter}
        onChange={handleSelectionChange}
        PaperComponent={({ children }) => <Paper elevation={0}>{children}</Paper>}
        sx={{
          "width": "240px",
          ".MuiInputBase-root": {
            backgroundColor: `${palette.success.main}`,
            borderRadius: "8px",
            border: `1px solid ${palette.success.main}`,
          },
          ".MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps} style={{ paddingTop: "8px", paddingBottom: "8px" }}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option}
            </li>
          );
        }}
        renderInput={params => (
          <TextField
            {...params}
            sx={{
              ".MuiAutocomplete-endAdornment": {
                display: "none",
              },
            }}
            placeholder={selectFilter.length === 0 ? "선택된 항목이 없습니다." : ""}
          />
        )}
        ListboxComponent={CustomListbox}
        ListboxProps={{
          style: {
            marginTop: "36px",
            overflowY: "scroll",
            padding: 0,
            maxHeight: "144px",
          },
        }}
      />
      <ButtonContainer>
        <CButton
          buttontype={
            currentOrder === "오름차순" ? "primarySpaureWhite" : "primarySquareWhiteSecond"
          }
          onClick={() => setCurrentOrder("오름차순")}
          sx={{ borderRadius: "999px" }}
        >
          오름차순
        </CButton>
        <CButton
          buttontype={
            currentOrder === "내림차순" ? "primarySpaureWhite" : "primarySquareWhiteSecond"
          }
          onClick={() => setCurrentOrder("내림차순")}
          sx={{ borderRadius: "999px" }}
        >
          내림차순
        </CButton>
      </ButtonContainer>
    </FilterContainer>
  );
}

/** styles */

const FilterContainer = styled.div`
  width: auto;
  height: 298px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 8px;
  background-color: ${palette.primary.contrastText};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CustomListbox = styled("ul")`
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${palette.primary.dark}1a;
    border-radius: 100px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${palette.primary.main};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 4px;
`;
