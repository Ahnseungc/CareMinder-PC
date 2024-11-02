import styled from "@emotion/styled";
import palette from "@styles/palette";
// import { CComboBox } from "@components/common/atom/C-ComboBox";
import { Typography } from "@mui/material";
import { ReactComponent as DeleteButton } from "@/assets/x-circle-fill.svg";
import { ReactComponent as EditButton } from "@/assets/Edit.svg";
import CSwitch from "@components/common/atom/C-Switch";

const columns = [
  { field: "section", headerName: "설정 구역" },
  { field: "wardName", headerName: "병동명" },
  { field: "manageName", headerName: "담당자" },
  { field: "loginId", headerName: "ID" },
  { field: "password", headerName: "PW" },
  { field: "managePhoneNumber", headerName: "담당자 번호" },
  { field: "manageEmail", headerName: "담당자 이메일" },
  { field: "edit", headerName: "" },
  { field: "delete", headerName: "" },
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

interface WardManagementTableProps {
  onEdit: () => void;
  onDelete: () => void;
}

const WardManagementTable = ({ onEdit, onDelete }: WardManagementTableProps) => {
  // const [options, setOptions] = useState<string[]>(["구역1", "구역2", "구역3", "구역4"]);

  const convertToAsterisks = (text: string) => {
    return "*".repeat(text.length);
  };
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
                <LongComBoxLayout>
                  {/* <CComboBox
                    placeholder={"구역"}
                    options={options}
                    value={""}
                    onChange={() => null}
                    allowCustomInput={true}
                    onCustomInputAdd={newValue => {
                      setOptions([...options, newValue]);
                    }}
                  /> */}
                </LongComBoxLayout>
              </td>
              <td>
                <ShortComBoxLayout>
                  <Typography>병동명</Typography>
                </ShortComBoxLayout>
              </td>
              <td>
                <ShortComBoxLayout>
                  <Typography>홍길동</Typography>
                </ShortComBoxLayout>
              </td>{" "}
              <td>
                <ShortComBoxLayout>
                  <Typography>User1234</Typography>
                </ShortComBoxLayout>
              </td>{" "}
              <td>
                <ShortComBoxLayout>
                  <Typography>{convertToAsterisks("password")}</Typography>
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
                <DeleteLayout>
                  <EditButton onClick={onEdit} />
                  <DeleteButton onClick={onDelete} />
                  <div style={{ marginLeft: "16px" }}>
                    <CSwitch onText="잠금" offText="잠금" />
                  </div>
                </DeleteLayout>
              </td>
            </tr>
          );
        })}
      </tbody>
    </StTable>
  );
};

export default WardManagementTable;

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

const LongComBoxLayout = styled.div`
  width: 224px;
  height: 36px;
  margin: 0 auto;
`;

const DeleteLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 140px;
  height: 36px;
  margin: 0 auto;
  cursor: pointer;
`;
