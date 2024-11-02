import styled from "@emotion/styled";
import palette from "@styles/palette";
import { Typography } from "@mui/material";
import CButton from "@components/common/atom/C-Button";

const columns = [
  { field: "hospitalName", headerName: "병원명" },
  { field: "hospitalAddress", headerName: "병원 주소" },
  { field: "name", headerName: "이름" },
  { field: "buinessNumber", headerName: "사업자등록번호" },
  { field: "loginId", headerName: "아이디" },
  { field: "password", headerName: "비밀번호" },
  { field: "email", headerName: "이메일" },
  { field: "accept", headerName: "" },
  { field: "reject", headerName: "" },
];

const rows = [{ id: 1, Section: "Snow", TableName: "Jon", PatientName: 35 }];

const AdminListTable = () => {
  return (
    <StTable>
      <thead>
        <tr>
          {columns.map((column, index) => {
            return <th key={index}>{column.headerName}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          return (
            <tr key={index}>
              <td>
                <ShortComBoxLayout>
                  <Typography>병원명</Typography>
                </ShortComBoxLayout>
              </td>
              <td>
                <ShortComBoxLayout>
                  <Typography>주소</Typography>
                </ShortComBoxLayout>
              </td>{" "}
              <td>
                <ShortComBoxLayout>
                  <Typography>이름</Typography>
                </ShortComBoxLayout>
              </td>{" "}
              <td>
                <ShortComBoxLayout>
                  <Typography>사업자등록번호</Typography>
                </ShortComBoxLayout>
              </td>{" "}
              <td>
                <ShortComBoxLayout>
                  <Typography>아이디</Typography>
                </ShortComBoxLayout>
              </td>{" "}
              <td>
                <ShortComBoxLayout>
                  <Typography>비밀번호</Typography>
                </ShortComBoxLayout>
              </td>
              <td>
                <ShortComBoxLayout>
                  <Typography>이메일</Typography>
                </ShortComBoxLayout>
              </td>
              <td>
                <LockingLayout>
                  <CButton
                    buttontype="primary"
                    sx={{
                      "backgroundColor": "#31D35F",
                      "&:hover": {
                        backgroundColor: "#28b851", // hover 시 더 진한 녹색으로
                      },
                    }}
                  >
                    수락
                  </CButton>
                </LockingLayout>
              </td>
              <td>
                <LockingLayout>
                  <CButton
                    buttontype="primary"
                    sx={{
                      "backgroundColor": "#F52C51",
                      "&:hover": {
                        backgroundColor: "#d41b3f", // hover 시 더 진한 빨간색
                      },
                    }}
                  >
                    거절
                  </CButton>
                </LockingLayout>
              </td>
            </tr>
          );
        })}
      </tbody>
    </StTable>
  );
};

export default AdminListTable;

const StTable = styled.table`
  width: 100%;
  height: 100%;
  & thead {
    width: 100%;
    height: 20%;
    & th {
      padding-bottom: 11.52px;
      color: ${palette.text.primary};
      border-bottom: 1px solid ${palette.divider};
    }
  }
  & tbody {
    width: 100%;
    & tr > td {
      padding-bottom: 11.52px;
      padding-top: 11.52px;
      text-align: center;
      border-bottom: 1px solid ${palette.divider};
    }
  }
`;

const ShortComBoxLayout = styled.div`
  width: 138px;
  height: 36px;
  margin: 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const LockingLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 80px;
  height: 36px;
  margin: 0 auto;
  cursor: pointer;
`;
