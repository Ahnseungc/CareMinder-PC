import { styled } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { ReactComponent as TrashIcon } from "@/assets/homeIcons/Trash.svg";
import { useState } from "react";
import useGetMemo from "@hooks/queries/useGetMemo";
import usePostMemo from "@hooks/mutation/usePostMemo";
import useDeleteMemo from "@hooks/mutation/useDeleteMemo";
import usePutMemo from "@hooks/mutation/usePutMemo";

export default function MemoBox({ color, patientId }: { color: string; patientId: number }) {
  const [changeMemo, setChangeMemo] = useState("");
  const [newMemo, setNewMemo] = useState("");
  const [isFocusId, setIsFocusId] = useState<undefined | number>(undefined);

  const { data, refetch } = useGetMemo(patientId);
  const { mutate: postMemo } = usePostMemo();
  const { mutate: deleteMemo } = useDeleteMemo();
  const { mutate: putMemo } = usePutMemo();

  const onPushMemo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (newMemo.trim().length === 0) return;
    postMemo(
      { patientId, content: newMemo },
      {
        onSuccess: () => {
          refetch();
        },
      },
    );

    setNewMemo("");
  };

  const onPutMemo = (e: React.MouseEvent, memoId: number) => {
    e.stopPropagation();
    if (changeMemo.trim().length === 0) return;
    putMemo(
      { memoId, changeMemo },
      {
        onSuccess: () => {
          refetch();
          setIsFocusId(undefined);
        },
      },
    );
  };

  const onDeleteMemo = (e: React.MouseEvent, memoId: number) => {
    e.stopPropagation();

    deleteMemo(memoId, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const getMonthDay = (createdAt: string) => {
    const [date, time] = createdAt.split("T");
    const [, month, day] = date.split("-");
    const [hour, min] = time.split(":");

    return `${month}월${day}일 ${hour}:${min}`;
  };

  return (
    <MemoWrapper>
      {data?.map(el => (
        <Memo key={el.createdAt}>
          {el.isMine && (
            <>
              <Title>내 메모</Title>
              {isFocusId === el.memoId ? (
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
                    e.stopPropagation(), setIsFocusId(el.memoId), setChangeMemo(el.content);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div>{el.content}</div> <Time>{getMonthDay(el.createdAt)}</Time>
                </Content>
              )}
            </>
          )}
          {!el.isMine && (
            <>
              <Title>{el.staffName}</Title>
              <Content>
                <div>{el.content}</div> <div>{el.createdAt}</div>
              </Content>
            </>
          )}

          {el.memoId === isFocusId && (
            <Icon onMouseDown={e => e.preventDefault()} onClick={e => onPutMemo(e, el.memoId)}>
              <CheckIcon fontSize="small" />
            </Icon>
          )}
          {el.isMine && el.memoId !== isFocusId && (
            <TrashBtn onClick={e => onDeleteMemo(e, el.memoId)}>
              <TrashIcon />
            </TrashBtn>
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
  align-items: end;
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

const TrashBtn = styled("div")`
  height: 25px;
  cursor: pointer;
  padding: 2px;
  margin-left: 8px;
`;
const Time = styled("div")`
  width: 300px;
  font-size: 10px;
  color: rgba(94, 95, 101, 1);
  text-align: end;
`;
