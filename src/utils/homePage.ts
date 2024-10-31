import { CSwitchProps, isRoleType } from "@models/home";
import { ReactComponent as IconNURSE } from "@/assets/homeIcons/Vector_NURSE.svg";
import { ReactComponent as IconASSISTANT } from "@/assets/homeIcons/Vector_NURSE_ASSISTANT.svg";
import { ReactComponent as IconWORKER } from "@/assets/homeIcons/Vector_WORKER.svg";
import { ReactComponent as IconDOCTOR } from "@/assets/homeIcons/Vector_Doctor.svg";

export type roleProps = "nerse" | "assistant" | "staff" | "doctor";

export function roleColor(role: Exclude<isRoleType, null>) {
  const select = {
    NURSE: {
      dark: "#04B300",
      normal: "#9CE09B",
      light: "#EAF8EA",
      sendIcon: IconNURSE,
    },
    NURSE_ASSISTANT: {
      dark: "#E97000",
      normal: "#FFC690",
      light: "#FFE9D3",
      sendIcon: IconASSISTANT,
    },
    WORKER: {
      dark: "#825DBE",
      normal: "#D5BCFF",
      light: "#EAE2F9",
      sendIcon: IconWORKER,
    },
    DOCTOR: {
      dark: "#5E5F65",
      normal: "#CFCFD1",
      light: "#E8E8E9",
      sendIcon: IconDOCTOR,
    },
    NOT_CLASSIFIED: {
      dark: "#04B300",
      normal: "#9CE09B",
      light: "#EAF8EA",
      sendIcon: IconNURSE,
    },
  };

  return select[role];
}

export const isFindRole = (role: CSwitchProps) => {
  switch (role) {
    case "간호사":
      return "NURSE";
    case "조무사":
      return "NURSE_ASSISTANT";
    case "직원":
      return "WORKER";
    case "의사":
      return "DOCTOR";
    case "전체":
      return null;
  }
};

export const bottomScroll = () => {
  setTimeout(function () {
    document!.getElementById("top")!.scrollTop = document!.getElementById("top")!.scrollHeight;
  }, 10);
};

export function formatTimestamp(createdAt: string) {
  const diffInMinutes = new Date().getMinutes() - new Date(createdAt).getMinutes();
  if (diffInMinutes < 1) return "방금 ";
  return diffInMinutes + "분";
}
