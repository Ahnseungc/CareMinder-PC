import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { CircularProgress, styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import useGetMemo from "@hooks/queries/useGetMemo";
import useCreateMemo from "@hooks/mutation/useCreateMemo";
import { useCallback, useState } from "react";
import { createMemoReqest } from "@hooks/mutation/useCreateMemo";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { formatDateDash } from "@utils/getDateform";

interface ChargeModalProps extends Omit<CMModalProps, "title"> {
  modalTitle: string;
  subTitle: string | React.ReactNode;
  patientId: number;
}

type MemoData = {
  memoId: number;
  staffName: string;
  staffRole: string;
  content: string;
  createdAt: string;
  isMine: true;
};

const MemoModal = ({ onClose, patientId, modalTitle, subTitle, ...props }: ChargeModalProps) => {
  const { data, isLoading } = useGetMemo(patientId);
  const [memo, setMemo] = useState<createMemoReqest>({ patientId: patientId, content: "" });
  const { mutate: createMemo } = useCreateMemo();
  const queryClient = useQueryClient();

  const handleCreateMemo = useCallback(() => {
    createMemo(
      { patientId: memo?.patientId as number, content: memo?.content as string },
      {
        onSuccess: () => {
          //@ts-ignore
          queryClient.invalidateQueries(["useGetMemo"]);
          toast.success("메모가 추가되었습니다.");
          onClose();
        },
        onError: error => {
          console.error(error);
          toast.error("메모 추가에 실패했습니다.");
        },
      },
    );
  }, [memo, patientId]);

  return (
    <CMModal
      maxWidth="xs"
      onClose={onClose}
      title={modalTitle !== null ? modalTitle : "이름 없음"}
      titleColor="#21262B"
      footer={
        <>
          <ModalActionButton hoverColor="#19181813" color="secondary" onClick={onClose}>
            취소
          </ModalActionButton>

          <ModalActionButton hoverColor="#30b3ff55" color="success" onClick={handleCreateMemo}>
            변경
          </ModalActionButton>
        </>
      }
      {...props}
    >
      <View sx={{ width: "100%", paddingLeft: "20px", paddingRight: "20px" }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            paddingBottom: "10px",
            paddingTop: "20px",
          }}
        >
          <Text>이전 메모</Text>
          {isLoading ? (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress size={5} color="secondary" />
            </Box>
          ) : (
            <Box sx={{ marginTop: 2 }}>
              {data?.map((memo: MemoData) => {
                return (
                  <Box sx={{ marginTop: 1, display: "flex", justifyContent: "space-between" }}>
                    <Typography
                      sx={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {memo.content}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Typography>{memo.staffName}</Typography>
                      <Typography>({formatDateDash(new Date(memo.createdAt))})</Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "start",
            paddingBottom: "10px",
            paddingTop: "20px",
          }}
        >
          <Text>메모</Text>
        </Box>
        <Textarea
          maxRows={5}
          aria-label="memo"
          placeholder="메모를 입력해주세요."
          minRows={5}
          defaultValue={""}
          onChange={e => {
            setMemo(prev => ({ ...prev, content: e.target.value }));
          }}
        />
      </View>
    </CMModal>
  );
};

const Text = styled(Typography)(() => ({
  color: "#000000",
  fontWeight: 600,
  fontSize: 14,
  lineHeight: "19.9px",
  letterSpacing: "-3%",
}));

const View = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}));
const Textarea = styled(BaseTextareaAutosize)(
  ({}) => `
    box-sizing: border-box;
    resize:none;
    width: 376px;
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
