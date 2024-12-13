import { useEffect, useState } from "react";
import { Autocomplete, Checkbox, ListItem, TextField } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import styled from "@emotion/styled";
import { useGetAreaList } from "@hooks/queries/useGetAreaList";
import { useSetRecoilState } from "recoil";
import { selectAreaState } from "@libraries/recoil";
import { Areas } from "@hooks/queries/useGetStaffList";

interface AreaAutoCompleteProp {
  value: Areas[];
}

const ComboBoxLayout = styled.div`
  height: 56px;
`;

const AreaComboBoxLayout = styled(ComboBoxLayout)`
  margin-bottom: 28px;
  p {
    font-size: 16px;
    font-weight: 500;
    color: #878787;
  }
`;

const AreaAutoComplete = ({ value }: AreaAutoCompleteProp) => {
  const { data: areaList } = useGetAreaList();
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const [selectedAreas, setSelectedAreas] = useState<string[]>(
    value?.map(area => area.areaName) || [],
  );
  const setSelectAreaState = useSetRecoilState(selectAreaState);

  const handleSelectionChange = (_: React.SyntheticEvent, newValue: string[]) => {
    setSelectedAreas(newValue);
  };

  const handleToggleAll = (event: React.MouseEvent) => {
    if (!areaList) {
      return;
    }
    event.preventDefault();
    const allSelected = areaList.length === selectedAreas.length;
    setSelectedAreas(allSelected ? [] : areaList.map(area => area.name));
  };

  useEffect(() => {
    if (areaList) {
      setSelectAreaState(
        selectedAreas.map(
          selectArea => areaList.find(area => area.name === selectArea)?.id as number,
        ),
      );
    }
  }, [selectedAreas, setSelectAreaState, areaList]);

  return (
    <AreaComboBoxLayout>
      {areaList && (
        <Autocomplete
          multiple
          limitTags={4}
          id="checkboxes-tags-demo"
          options={areaList.map(area => area.name)}
          value={selectedAreas}
          disableCloseOnSelect
          onChange={handleSelectionChange}
          renderOption={(props, option, { selected }) => (
            <ListItem {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option}
            </ListItem>
          )}
          renderInput={params => <TextField {...params} placeholder="구역을 선택해주세요" />}
          ChipProps={{ size: "small" }}
          ListboxProps={{
            style: { padding: 0 },
          }}
          ListboxComponent={props => (
            <ul {...props}>
              <ListItem
                onClick={handleToggleAll}
                style={{
                  borderBottom: "1px solid #eee",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "white",
                  zIndex: 1,
                  cursor: "pointer",
                }}
              >
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={areaList.length === selectedAreas.length}
                />
                전체 선택
              </ListItem>
              {props.children}
            </ul>
          )}
        />
      )}
    </AreaComboBoxLayout>
  );
};

export default AreaAutoComplete;
