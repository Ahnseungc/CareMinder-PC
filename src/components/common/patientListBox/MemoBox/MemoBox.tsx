import { styled } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { ReactComponent as TrashIcon } from "@/assets/homeIcons/Trash.svg";
import { useState } from "react";
import useGetMemo from "@hooks/queries/useGetMemo";
import usePostMemo from "@hooks/mutation/usePostMemo";

export default function MemoBox({ color, patientId }: { color: string; patientId: number }) {
  const [changeMemo, setChangeMemo] = useState("");
  const [newMemo, setNewMemo] = useState("");
  const [isFocusId, setIsFocusId] = useState<undefined | number>(undefined);

  const { data, refetch } = useGetMemo(patientId);
  const { mutate: postMemo } = usePostMemo();
  console.log(data);
  const onPushMemo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (newMemo.trim().length === 0) return;
    postMemo(
      { patientId, content: newMemo },
      {
        onSuccess: () => {
          refetch();
        },
        onError: () => {},
      },
    );

    setNewMemo("");
  };

  const onDeleteMemo = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("memo 삭제");
  };

  return (
    <MemoWrapper>
      {data?.map(el => (
        <Memo key={el.createdAt}>
          {/* {el.isMine && (
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
          )} */}
          {/* {!el.isMine && ( */}
          <>
            <Title>{el.staffName}</Title>
            <Content>
              <div>{el.content}</div> <div>{el.createdAt}</div>
            </Content>
          </>
          {/* )} */}

          {/* {el.id === isFocusId && (
            <Icon onClick={e => onPushMemo(e)}>
              <CheckIcon fontSize="small" />
            </Icon>
          )}
          {el.isMine && el.id !== isFocusId && (
            <Icon onClick={e => onDeleteMemo(e)}>
              <TrashIcon />
            </Icon>
          )} */}
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
