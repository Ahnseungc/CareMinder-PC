import { isRoleType } from "@models/home";

export type roleProps = "nerse" | "assistant" | "staff" | "doctor";

export function roleColor(role: Exclude<isRoleType, null>) {
  const select = {
    NURSE: {
      dark: "#30B4FF",
      light: "#D6F0FF",
    },
    NURSE_ASSISTANT: {
      dark: "#F24679",
      light: "#FCDAE4",
    },
    WORKER: {
      dark: "#5D6DBE",
      light: "#DCE2FF",
    },
    DOCTOR: {
      dark: "#5E5F65",
      light: "#E8E8E9",
    },
    NOT_CLASSIFIED: {
      dark: "#30B4FF",
      light: "#D6F0FF",
    },
  };

  return select[role];
}
