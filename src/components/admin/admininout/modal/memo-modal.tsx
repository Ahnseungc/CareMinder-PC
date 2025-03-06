import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { useState } from "react";
import useGetPatientMemo from "@hooks/queries/useGetPatientMemo";
import { ReactComponent as Plus } from "@/assets/plus.svg";
import { ReactComponent as Edit } from "@/assets/edit2.svg";
import { ReactComponent as Delete } from "@/assets/delete2.svg";
import usePostMemo from "@hooks/mutation/usePostMemo";
import DeleteModal from "./deleteModal";
import useDeleteMemo from "@hooks/mutation/useDeleteMemo";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import useEditMemo from "@hooks/mutation/useEditMemo";
import { formatDateDash } from "@utils/getDateform";

interface ChargeModalProps extends Omit<CMModalProps, "title"> {
  modalTitle: string;
  selectList: any;
}

export interface PostMemoType {
  patientIds: number[];
  content: string;
}

interface MemoListType {
  content: string;
  createdAt: string;
  isMine: boolean;
  lastModifiedAt: string;
  memoId: number;
  staffName: string;
  staffRole: string;
}

const MemoModal = ({ onClose, modalTitle, selectList, ...props }: ChargeModalProps) => {
  const [memo, setMemo] = useState<string>("");
  const [deleteMemo, setDeleteMemo] = useState<undefined | number>(undefined);
  const [editId, setEditId] = useState<undefined | { id: number; content: string }>(undefined);

  const { data: getMemoList, refetch } = useGetPatientMemo(selectList[0].id, selectList.length);
  const { mutate: postMemo } = usePostMemo();
  const { mutate: delMemo } = useDeleteMemo(refetch, setDeleteMemo);
  const { mutate: editMemo } = useEditMemo();

  const onAddMemo = () => {
    const data = {
      patientIds: selectList.map((el: { id: number }) => el.id),
      content: memo,
    };

    postMemo(data, {
      onSuccess: () => {
        setMemo(""), refetch();
      },
    });
  };

  const onEditMemo = () => {
    editMemo(editId!, {
      onSuccess: () => {
        setEditId(undefined);
        refetch();
      },
    });
  };

  return (
    <CMModal
      maxWidth="md"
      onClose={onClose}
      title={modalTitle !== null ? modalTitle : "미지정"}
      titleColor="#21262B"
      footer={
        <>
          <ModalActionButton hoverColor="#19181813" color="secondary" onClick={onClose}>
            취소
          </ModalActionButton>

          {/* <ModalActionButton hoverColor="#30b3ff55" color="success" onClick={() => null}>
            확인
          </ModalActionButton> */}
        </>
      }
      {...props}
    >
      <DeleteModal
        onClose={() => setDeleteMemo(undefined)}
        open={deleteMemo !== undefined ? true : false}
        onDelete={() => delMemo(deleteMemo!)}
      />

      <View sx={{ width: "100%", paddingLeft: "20px", paddingRight: "20px" }}>
        {selectList.length === 1 ? (
          <Name>{selectList[0].name === "" ? "미지정" : selectList[0].name} 환자</Name>
        ) : (
          <Name2>
            선택 환자 모두 보기
            <Selects>
              {selectList.map((el: { name: string }) => (
                <span>{el.name === "" ? "미지정" : el.name},</span>
              ))}
            </Selects>
          </Name2>
        )}
        <Box sx={{ width: "100%", maxHeight: "390px", margin: "16px 0px", overflow: "auto" }}>
          {selectList.length === 1 &&
            getMemoList?.map((memo: MemoListType) => (
              <MemoBox key={memo.memoId}>
                <Top>
                  <div>
                    <span>{memo.staffName}</span>
                    <span>{formatDateDash(new Date(memo?.createdAt))}</span>
                  </div>
                  <div>
                    {memo.isMine && (
                      <>
                        <span style={{ cursor: "pointer" }}>
                          {editId?.id === memo.memoId ? (
                            <CloseIcon
                              fontSize="small"
                              color="disabled"
                              onClick={() => setEditId(undefined)}
                            />
                          ) : (
                            <Edit
                              onClick={() => setEditId({ id: memo.memoId, content: memo.content })}
                            />
                          )}
                        </span>
                        <span style={{ marginLeft: "16px", cursor: "pointer" }}>
                          {editId?.id === memo.memoId ? (
                            <DoneIcon fontSize="small" color="secondary" onClick={onEditMemo} />
                          ) : (
                            <Delete onClick={() => setDeleteMemo(memo.memoId)} />
                          )}
                        </span>
                      </>
                    )}
                  </div>
                </Top>
                <Bottom>
                  {editId?.id === memo.memoId ? (
                    <Textarea
                      value={editId.content}
                      onChange={e => setEditId(prev => ({ id: prev!.id, content: e.target.value }))}
                    />
                  ) : (
                    <>{memo.content}</>
                  )}
                </Bottom>
              </MemoBox>
            ))}
        </Box>

        <TextAreaBox>
          <TextAreaTop>
            <div>
              <Plus /> <span> 새 메모</span>
            </div>
            <AddBtn onClick={onAddMemo}>완료</AddBtn>
          </TextAreaTop>
          <Textarea
            maxRows={3}
            aria-label="memo"
            placeholder="메모를 입력하세요."
            minRows={3}
            value={memo}
            onChange={e => setMemo(e.target.value)}
          />
        </TextAreaBox>
      </View>
    </CMModal>
  );
};

const View = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}));

const MemoBox = styled("div")(() => ({
  background: "#FAFAFB",
  borderRadius: "16px",
  padding: "16px 20px 16px 20px",
  color: "#5E5F65",
  marginBottom: "16px",
  fontSize: "16px",
}));
const Top = styled("div")(() => ({
  "display": "flex",
  "justifyContent": "space-between",
  "alignContent": "center",

  "&>div:first-child>span:first-child": {
    color: "#1F1F1F",
    marginRight: "6px",
    fontWeight: "600",
  },
  "&>div:first-child>span:last-child": {
    color: "#949599",
    fontSize: "14px",
  },
}));
const Bottom = styled("div")(() => ({
  color: "#5E5F65",
  fontWeight: "400",
  fontSize: "14px",
}));
const TextAreaBox = styled("div")(() => ({
  background: "#EAF7FF",
  width: "100%",
  padding: "20px 16px",
  borderRadius: "16px",
}));
const TextAreaTop = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "6px",
  color: "#30B4FF",
  fontSize: "14px",
}));
const AddBtn = styled("div")(() => ({
  background: "#FFFFFF",
  border: "1px solid #30B4FF",
  borderRadius: "6px",
  padding: "3px 5px",
  cursor: "pointer",
}));

const Textarea = styled(BaseTextareaAutosize)(
  ({}) => `
    box-sizing: border-box;
    resize:none;
    width:100%;
    height: 140px;
    border:1px solid #ECECEC;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    /* firefox */
    &:focus-visible {
      outline: 0;
    }
  `,
);

const Name = styled("div")(() => ({
  color: "#30B4FF",
  fontSize: "16px",
  fontWeight: "600",
}));
const Name2 = styled("div")(() => ({
  "color": "#30B4FF",
  "fontSize": "16px",
  "fontWeight": "600",
  "borderBottom": "1px solid #30B4FF",
  "cursor": "pointer",
  "position": "relative",
  ":hover": {
    "&>div": {
      display: "block",
    },
  },
}));

const Selects = styled("div")(() => ({
  "background": "#00000081",
  "width": "360px",
  "maxHeight": "70px",
  "borderRadius": "4px",
  "color": "#FFFFFF",
  "padding": "8px 12px",
  "fontSize": "12px",
  "position": "absolute",
  "top": "30px",
  "right": "-100%",
  "&>span": {
    marginRight: "2px",
  },
  "display": "none",
}));

export default MemoModal;
