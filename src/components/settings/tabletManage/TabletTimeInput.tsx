import { Autocomplete, Paper, styled, TextField } from "@mui/material";
import { ReactComponent as DownArrow } from "@assets/downarrow-middle-icon.svg";
import { Hours, Minutes } from "../const";

export default function TabletTimeInput() {
  return (
    <>
      <Autocomplete
        disablePortal
        disableClearable
        popupIcon={<DownArrow />}
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
