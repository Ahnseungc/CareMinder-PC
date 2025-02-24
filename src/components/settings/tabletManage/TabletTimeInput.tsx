import { Autocomplete, Paper, styled, TextField } from "@mui/material";
import { ReactComponent as DownArrow } from "@assets/downarrow-middle-icon.svg";
import { Hours, Minutes } from "../const";
import React from "react";

interface TabletTimeInputProps {
  hourValue: number;
  minuteValue: number;
  onHourChange: React.Dispatch<React.SetStateAction<number>>;
  onMinuteChange: React.Dispatch<React.SetStateAction<number>>;
}

export default function TabletTimeInput({
  hourValue,
  minuteValue,
  onHourChange,
  onMinuteChange,
}: TabletTimeInputProps) {
  return (
    <>
      <Autocomplete
        disablePortal
        disableClearable
        popupIcon={<DownArrow />}
        value={Hours.find(hour => hour.label === String(hourValue).padStart(2, "0"))}
        onChange={(_, value) => {
          if (value && value.label) {
            onHourChange(parseInt(value.label, 10));
          }
        }}
        options={Hours}
        PaperComponent={CustomPaper}
        ListboxProps={{
          style: {
            maxHeight: "200px",
          },
        }}
        sx={{
          "width": "123px",
          "marginRight": "8px",
          ".MuiInputBase-input": {
            height: "15px",
          },
        }}
        renderInput={params => <TextField {...params} />}
      />
      시
      <Autocomplete
        disablePortal
        disableClearable
        popupIcon={<DownArrow />}
        value={Minutes.find(minute => minute.label === String(minuteValue).padStart(2, "0"))}
        onChange={(_, value) => {
          if (value && value.label) {
            onMinuteChange(parseInt(value.label, 10));
          }
        }}
        options={Minutes}
        PaperComponent={CustomPaper}
        ListboxProps={{
          style: { maxHeight: "200px" },
        }}
        sx={{
          "width": "123px",
          "margin": "0 8px",
          ".MuiInputBase-input": {
            height: "15px",
          },
        }}
        renderInput={params => <TextField {...params} />}
      />
      분
    </>
  );
}

/** styles */

const CustomPaper = styled(Paper)`
  & ::-webkit-scrollbar {
    width: 4px;
  }
  & ::-webkit-scrollbar-track {
    background: #0000001a;
    border-radius: 100px;
  }
  & ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  & ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;
