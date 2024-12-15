import { styled } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { ReactComponent as TrashIcon } from "@/assets/homeIcons/Trash.svg";
import { useState } from "react";

export default function MemoBox({ color }: { color: string }) {
  const [mock, setMock] = useState([
    {
      name: "간호사1",
      id: 12,
      contents: "음...이거 뭐 해야합니다!!",
      isMine: true,
      time: "2024.12.31",
    },
    {
      name: "간호사1",
      id: 13,
      contents: "음...이거 뭐 해야합니다!!",
      isMine: false,
      time: "2024.12.31",
    },
    {
      name: "간호사1",
      id: 14,
      contents: "음...이거 뭐 해야합니다!!",
      isMine: true,
      time: "2024.12.31",
    },
    {
      name: "간호사1",
      id: 15,
      contents: "음...이거 뭐 해야합니다!!",
      isMine: false,
      time: "2024.12.31",
    },
  ]);
  const [changeMemo, setChangeMemo] = useState("");
  const [newMemo, setNewMemo] = useState("");
  const [isFocusId, setIsFocusId] = useState<undefined | number>(undefined);

  const onPushMemo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (newMemo.trim().length === 0) return;
    setMock([
      ...mock,
      { name: "간호사1", contents: newMemo, isMine: true, time: "2024.12.31", id: 16 },
    ]);
    setNewMemo("");
  };

  const onDeleteMemo = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("memo 삭제");
  };

  return (
    <MemoWrapper>
      {mock.map(el => (
        <Memo>
          {el.isMine && (
            <>
              <Title>내 메모</Title>
              {isFocusId === el.id ? (
                <MemoInput
                  placeholder="메모를 입력해주세요"
                  onChange={e => setChangeMemo(e.target.value)}
                  onBlur={() => setIsFocusId(undefined)}
                  onClick={e => e.stopPropagation()}
                  value={changeMemo}
                  color={color}
                  autoFocus
                />
              ) : (
                <Content
                  onClick={e => {
                    e.stopPropagation(), setIsFocusId(el.id);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div>{el.contents}</div> <div>{el.time}</div>
                </Content>
              )}
            </>
          )}
          {!el.isMine && (
            <>
              <Title>{el.name}</Title>
              <Content>
                <div>{el.contents}</div> <div>{el.time}</div>
              </Content>
            </>
          )}

          {el.id === isFocusId && (
            <Icon onClick={e => onPushMemo(e)}>
              <CheckIcon fontSize="small" />
            </Icon>
          )}
          {el.isMine && el.id !== isFocusId && (
            <Icon onClick={e => onDeleteMemo(e)}>
              <TrashIcon />
            </Icon>
          )}
        </Memo>
      ))}

      <Memo>
        <Title>내 메모</Title>
        <MemoInput
          placeholder="메모를 입력해주세요"
          onChange={e => setNewMemo(e.target.value)}
          value={newMemo}
          color={"white"}
          onClick={e => e.stopPropagation()}
        />
        <Icon onClick={onPushMemo}>
          <CheckIcon fontSize="small" />
        </Icon>
      </Memo>
    </MemoWrapper>
  );
}

const MemoWrapper = styled("div")``;
const Memo = styled("div")`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.palette.text.primary};
  margin-bottom: 12px;
`;
const Title = styled("div")`
  font-size: 13px;
  font-weight: 700;
  width: 65px;
  margin-left: 20px;
`;
const Content = styled("div")`
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  padding: 4px 6px 4px 10px;
  margin-left: 4px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Icon = styled("div")`
  height: 25px;
  cursor: pointer;
  padding: 2px;
  margin-left: 4px;
`;
const MemoInput = styled("input")<{ color: string }>`
  width: 100%;
  border-radius: 6px;
  margin-left: 6px;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  background-color: ${({ color }) => color};
  padding: 6px 6px 6px 10px;
  :focus {
    outline: none;
  }
`;
