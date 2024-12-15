import { PropsWithChildren } from "react";
import { RecoilRoot } from "recoil";
import MuiSetting from "@libraries/mui/MuiSetting";
import ReactQuerySetting from "@libraries/reactQuery/ReactQuerySetting";
import ToastSetting from "@libraries/toast/ToastSetting";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function AppRegister({ children }: PropsWithChildren) {
  return (
    <MuiSetting>
      <ReactQuerySetting>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <RecoilRoot>
            {children}
            <ToastSetting />
          </RecoilRoot>
        </LocalizationProvider>
      </ReactQuerySetting>
    </MuiSetting>
  );
}
