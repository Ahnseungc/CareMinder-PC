// CompletedPatientListBox
// StaffPatientListBox
// MainpatientListBox

import { Stack, styled } from "@mui/material";

export const InnerContainer = styled(Stack)<{ color: string }>`
  position: relative;
  width: 100%;
  padding: 0 13px;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
`;
export const LeftLine = styled("div")<{ color: string }>`
  width: 4px;
  height: 100%;
  border-radius: 4px;
  background-color: ${({ color }) => color};
  position: absolute;
  left: 0;
`;

export const Title = styled("div")<{ color: string }>`
  font-weight: 700;
  font-size: 16px;
  color: #000000;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  margin-right: 30px;
  & > div {
    display: flex;
  }
  & > div > span {
    margin: 0 5px;
  }
`;

export const TitleRight = styled("div")`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.primary};
  cursor: pointer;
`;

export const TxtBox = styled("div")<{ color: string }>`
  border-radius: 6px;
  width: 100%;
  border: 3px solid ${({ color }) => color};
  padding: 6px 16px 6px 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.palette.primary.dark};
  display: flex;
  justify-content: space-between;
`;
export const TxtBoxLeft = styled("div")`
  display: flex;
  align-items: center;
`;

export const Vector = styled("div")<{ isMemo: boolean }>`
  transform: ${({ isMemo }) => isMemo && "rotate(-90deg)"};
  margin-right: 8px;
`;

export const TxtBoxRight = styled("div")`
  color: ${({ theme }) => theme.palette.text.primary};
  min-width: 60px;
  text-align: end;
`;

export const Bottom = styled("div")`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

export const Dot = styled("div")`
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: flex;
  margin-left: 6px;
  align-items: center;
  justify-content: center;
`;

export const Options = styled("div")`
  background-color: ${({ theme }) => theme.palette.primary.contrastText};
  position: absolute;
  right: 0px;
  top: 40px;
  padding: 11px;
  box-shadow: 0px 4px 12px 0px #89898e4d;
  border-radius: 8px;
  & > div:first-of-type {
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  }
  & > span {
    font-size: 13px;
    font-weight: 700;
    color: ${({ theme }) => theme.palette.primary.dark};
  }
  z-index: 100;
`;

export const Option = styled("div")`
  font-size: 13px;
  color: ${({ theme }) => theme.palette.primary.dark};
  font-weight: 500;
  padding: 8px 0;
  cursor: pointer;
  width: 69px;
  :hover {
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;

export const Check = styled("div")<{ color: string }>`
  background-color: ${({ color }) => color};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
  font-weight: 900;
  cursor: pointer;
`;
