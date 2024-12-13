import { PropsWithChildren } from "react";
import { RecoilRoot } from "recoil";
import MuiSetting from "@libraries/mui/MuiSetting";
import ReactQuerySetting from "@libraries/reactQuery/ReactQuerySetting";
import ToastSetting from "@libraries/toast/ToastSetting";

// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
// import { ko } from "date-fns/locale/ko";

export default function AppRegister({ children }: PropsWithChildren) {
  return (
    <MuiSetting>
      <ReactQuerySetting>
        {/* <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}> */}
        <RecoilRoot>
          {children}
          <ToastSetting />
        </RecoilRoot>
        {/* </LocalizationProvider> */}
      </ReactQuerySetting>
    </MuiSetting>
  );
}
