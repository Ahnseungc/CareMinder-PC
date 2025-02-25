import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { useState } from "react";
import useGetPatientMemo from "@hooks/queries/useGetPatientMemo";
import { ReactComponent as Plus } from "@/assets/plus.svg";

interface ChargeModalProps extends Omit<CMModalProps, "title"> {
  modalTitle: string;
  selectList: any;
}

const MemoModal = ({ onClose, modalTitle, selectList, ...props }: ChargeModalProps) => {
  const { data: getMemoList } = useGetPatientMemo(selectList.map((el: { id: number }) => el.id));
  const [memo, setMemo] = useState<string>("");

  const onAddMemo = () => {
    console.log(memo);
    //mutate 메모 등록
    //등록하면  메모 조회 다시 들고오기 //    refetch();
  };

  return (
    <CMModal
      maxWidth="md"
      onClose={onClose}
      title={modalTitle !== null ? modalTitle : "이름 없음"}
      titleColor="#21262B"
      footer={
        <>
          <ModalActionButton hoverColor="#19181813" color="secondary" onClick={onClose}>
            취소
          </ModalActionButton>

          <ModalActionButton hoverColor="#30b3ff55" color="success" onClick={() => null}>
            확인
          </ModalActionButton>
        </>
      }
      {...props}
    >
      <View sx={{ width: "100%", paddingLeft: "20px", paddingRight: "20px" }}>
        <Box sx={{ width: "100%", maxHeight: "390px", margin: "16px 0px", overflow: "auto" }}>
          {getMemoList?.map((memo: any) => (
            <MemoBox key={memo.patientId}>
              <Top>
                <span>name</span>
                <span>date</span>
              </Top>
              <Bottom>{memo.content}</Bottom>
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
            defaultValue={""}
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
  "&>span:first-child": {
    color: "#1F1F1F",
    marginRight: "6px",
    fontWeight: "600",
  },
  "&>span:last-child": {
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

export default MemoModal;
