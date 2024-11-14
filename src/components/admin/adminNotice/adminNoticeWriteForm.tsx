import { ChangeEvent, FC, Ref } from "react";
import { Box, styled, Typography, SvgIcon, FormControl, TextField, Button } from "@mui/material";
import CInput from "@components/common/atom/C-Input";
import { ReactComponent as PhotoIcon } from "@assets/photo-icon.svg";
import { Controller, UseFormReturn } from "react-hook-form";
import { NoticeReqType } from "@models/notice";
import { ReactComponent as XIcon } from "@assets/x-Icon.svg";

interface AdminNoticeWriteFormProps {
  form: UseFormReturn<NoticeReqType>;
  handleFileUploadClick: () => void;
  fileRef: Ref<HTMLInputElement>;
  handleFileUploadUrl: (e: ChangeEvent<HTMLInputElement>) => void;
  fileUrl: Array<{ name: string; url: string }>;
  handleFileUploadUrlDelete: (index: number) => void;
  selected: Array<{
    id: number;
    name: string;
  }>;
  handleRecipientDelete: (index: number) => void;
}

const AdminNoticeWriteForm: FC<AdminNoticeWriteFormProps> = ({
  form,
  handleFileUploadClick,
  fileRef,
  handleFileUploadUrl,
  handleFileUploadUrlDelete,
  fileUrl,
  selected,
  handleRecipientDelete,
}) => {
  const {
    control,
    formState: { errors },
  } = form;
  return (
    <StyledBox>
      <FormControl error={Boolean(errors)}>
        <Title>공지 작성</Title>
        <InputForm>
          <label htmlFor="">수신자</label>
          <InputLayout>
            <RecipientBox>
              {selected.map((res, index) => {
                return (
                  <RecipientCard key={res.id}>
                    <p>{res.name}</p>
                    <SvgIcon
                      component={XIcon}
                      inheritViewBox
                      onClick={() => handleRecipientDelete(index)}
                    />
                  </RecipientCard>
                );
              })}
            </RecipientBox>
          </InputLayout>
        </InputForm>
        <InputForm>
          <label htmlFor="">제목</label>
          <InputLayout>
            <Controller
              control={control}
              name={"title"}
              render={({ field }) => (
                <CInput
                  {...field}
                  variant={"outlined"}
                  placeholder={"제목을 입력해주세요."}
                  disabled={false}
                  id={""}
                />
              )}
            />
          </InputLayout>
        </InputForm>
        <InputForm>
          <InputForm>
            <TextAreaLabel>
              <p>내용</p>
              <p className="blue">즐겨찾기 등록</p>
            </TextAreaLabel>
            <TextAreaLayout>
              <Controller
                control={control}
                name={"content"}
                render={({ field }) => (
                  <StyledTextArea placeholder="내용을 입력해주세요." multiline {...field} />
                )}
              />
            </TextAreaLayout>
          </InputForm>
        </InputForm>

        <InputForm>
          <p>사진 첨부</p>
          <FileUrlLayout>
            <AddPhotoButton onClick={handleFileUploadClick}>
              <SvgIcon component={PhotoIcon} inheritViewBox />
              사진 첨부
            </AddPhotoButton>
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              onChange={handleFileUploadUrl}
              style={{ display: "none" }} // input 요소 숨기기
            />
            <FileListLayout>
              {fileUrl.length !== 0 &&
                fileUrl?.map((file, index) => {
                  return (
                    <FileUrlBox key={file.name}>
                      <p>{file.name}</p>
                      <SvgIcon
                        component={XIcon}
                        inheritViewBox
                        onClick={() => handleFileUploadUrlDelete(index)}
                      />
                    </FileUrlBox>
                  );
                })}
            </FileListLayout>
          </FileUrlLayout>
        </InputForm>
      </FormControl>
    </StyledBox>
  );
};

const RecipientBox = styled(Box)(() => ({
  width: "100%",
  height: "40px",
  display: "flex",
  border: `1px solid lightgray`,
  borderRadius: "6px",
  alignItems: "center",
  padding: "6px",
  gap: "8px",
}));
const RecipientCard = styled(Box)(({ theme }) => ({
  "width": "82px",
  "height": "26px",
  "display": "flex",
  "justifyContent": "center",
  "alignItems": "center",
  "backgroundColor": theme.palette.success.main,
  "borderRadius": "100px",
  "gap": "10px",
  "& svg": {
    width: "16px",
    height: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },

  "& p": {
    height: "16px",
    display: "flex",
    alignItems: "center",
    color: `${theme.palette.text.disabled}`,
  },
}));

const Title = styled(Typography)(({}) => ({
  fontSize: "18px",
  fontWeight: "700",
  lineHeight: "26px",
  letterSpacing: "-0.03em",
  color: "black",
}));

const StyledBox = styled(FormControl)(({ theme }) => ({
  width: "50%",
  height: "100%",
  backgroundColor: "white",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "24px",
  padding: "34.5px 24px 62.45px 24px",
}));

const InputLayout = styled(Box)({
  width: "100%",
  height: "40px",
  marginTop: "10px",
});

const TextAreaLayout = styled(Box)({
  width: "100%",
  height: "191px",

  marginTop: "24px",
});

const InputForm = styled(Box)(({ theme }) => ({
  "marginTop": "24px",

  "& p": {
    fontSize: "14px",
    fontWeight: "700",
    lineHeight: "20px",
    color: "black",
  },
  "& label": {
    fontSize: "14px",
    fontWeight: "700",
    lineHeight: "20px",
    color: "black",
  },

  "& .blue": {
    color: `${theme.palette.primary.main}`,
  },
}));

const TextAreaLabel = styled(Box)({
  display: "flex",
  alignItems: 'center"',
  height: "20px",
  width: "100%",
  justifyContent: "space-between",
  marginTop: "10px",
});

const StyledTextArea = styled(TextField)(({ theme }) => ({
  "border": `1px solid ${theme.palette.divider}`,
  "width": "100%",
  "height": "100%",

  "& .MuiInputBase-root": {
    height: "100%",
    alignItems: "flex-start", // 텍스트 상단 정렬
  },

  "& .MuiInputBase-inputMultiline": {
    textAlign: "left",
    height: "100%",
    width: "100%",
    lineHeight: "1.6",
    boxSizing: "border-box",
  },
}));

const AddPhotoButton = styled(Button)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  color: `${theme.palette.text.primary}`,
  width: "112px",
  height: "40px",
  display: "flex",
  alignItems: "center",
  gap: "4px",
}));

const FileUrlLayout = styled(Box)(() => ({
  width: "100%",
  alignItems: "center",
  height: "100%",
  display: "flex",
  gap: "15.71px",
}));

const FileUrlBox = styled(Box)(({ theme }) => ({
  "display": "flex",
  "alignItems": "center",
  "gap": "2px",
  "height": "20px",
  "& p": {
    color: `${theme.palette.text.primary}`,
  },
  "& svg": {
    width: "16px",
    height: "16px",
    cursor: "pointer",
  },
}));
const FileListLayout = styled(Box)(() => ({
  width: "590px",
  height: "54px",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "6px",
}));

export default AdminNoticeWriteForm;
