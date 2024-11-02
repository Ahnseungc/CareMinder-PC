import styled from "@emotion/styled";
import palette from "@styles/palette";
import { Typography } from "@mui/material";
import CSwitch from "@components/common/atom/C-Switch";

const columns = [
  { field: "staffName", headerName: "스태프 이름" },
  { field: "occupation", headerName: "직업" },
  { field: "section", headerName: "구역" },
  { field: "loginId", headerName: "아이디" },
  { field: "phoneNumber", headerName: "전화 번호" },
  { field: "email", headerName: "이메일" },
  { field: "lock", headerName: "" },
];

const rows = [
  { id: 1, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 2, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 3, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 4, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 5, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 6, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 7, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 8, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 9, Section: "Snow", TableName: "Jon", PatientName: 35 },
];

const StaffManagementTable = () => {
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
        {rows.map(() => {
          return (
            <tr>
              <td>
                <ShortComBoxLayout>
                  <Typography>홍길동</Typography>
                </ShortComBoxLayout>
              </td>
              <td>
                <ShortComBoxLayout>
                  <Typography>간호사</Typography>
                </ShortComBoxLayout>
              </td>{" "}
              <td>
                <ShortComBoxLayout>
                  <Typography>구역명</Typography>
                </ShortComBoxLayout>
              </td>{" "}
              <td>
                <ShortComBoxLayout>
                  <Typography>User1234</Typography>
                </ShortComBoxLayout>
              </td>{" "}
              <td>
                <ShortComBoxLayout>
                  <Typography>010-0000-0000</Typography>
                </ShortComBoxLayout>
              </td>{" "}
              <td>
                <ShortComBoxLayout>
                  <Typography>User1234@naver.com</Typography>
                </ShortComBoxLayout>
              </td>
              <td>
                <LockingLayout>
                  <div style={{ marginLeft: "16px" }}>
                    <CSwitch onText="잠금" offText="잠금" />
                  </div>
                </LockingLayout>
              </td>
            </tr>
          );
        })}
      </tbody>
    </StTable>
  );
};

export default StaffManagementTable;

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

  width: 140px;
  height: 36px;
  margin: 0 auto;
  cursor: pointer;
`;
