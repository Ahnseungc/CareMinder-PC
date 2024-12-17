import styled from "@emotion/styled";
import { TextField } from "@mui/material";
import { ReactComponent as UploadMemo } from "@/assets/UploadMemo.svg";
import useCreateArea from "@hooks/mutation/useCreateArea";
import { useRef } from "react";
import { toast } from "react-toastify";

interface AddAreaListProps {
  wardId: number;
}

export default function AddAreaList({ wardId }: AddAreaListProps) {
  const { mutate: createArea } = useCreateArea();
  const areaNameRef = useRef<HTMLInputElement>(null);
  const areaMemoRef = useRef<HTMLInputElement>(null);

  const handleCreateArea = () => {
    const newAreaName = areaNameRef.current?.value;
    const newAreaMemo = areaMemoRef.current?.value || "";

    if (newAreaName) {
      createArea(
        { name: newAreaName, memo: newAreaMemo, wardId: wardId },
        {
          onSuccess: () => {
            if (areaNameRef.current) {
              areaNameRef.current.value = "";
            }
            if (areaMemoRef.current) {
              areaMemoRef.current.value = "";
            }
            toast.success("구역이 추가되었습니다.");
          },
          onError: error => {
            console.error(error);
            toast.error("구역 추가에 실패했습니다.");
          },
        },
      );
    }
  };

  return (
    <Container>
      <InputWrapper width="205px">
        <StyledTextField
          inputRef={areaNameRef}
          size="small"
          variant="filled"
          InputProps={{ disableUnderline: true }}
          placeholder="구역명을 입력해주세요"
          backgroundColor="#F5F5F5"
          // onChange={e => console.log(e.target.value)}
        />
      </InputWrapper>
      <InputWrapper width="800px">
        <StyledTextField
          inputRef={areaMemoRef}
          size="small"
          variant="filled"
          InputProps={{ disableUnderline: true }}
          placeholder="메모를 남겨주세요"
          backgroundColor="#F5F5F5"
          sx={{ width: "100%" }}
        />
      </InputWrapper>
      <InputWrapper width="70px">
        <UploadButton onClick={handleCreateArea}>
          <UploadMemo />
        </UploadButton>
      </InputWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 8px 7px;
  border-bottom: 1px solid #d9d9d9;
`;

const InputWrapper = styled.div<{ width: string }>`
  width: ${(props: { width: string }) => props.width};
`;

const StyledTextField = styled(TextField)<{ backgroundColor?: string }>`
  /* padding: 8px 12px; */

  .MuiInputBase-root {
    height: 32px;
    border-radius: 1px;
    background-color: ${(props: { backgroundColor: string }) =>
      props.backgroundColor || "transparent"};
  }

  .MuiInputBase-input {
    font-size: 14px;
    padding: 8px;
  }
`;

const UploadButton = styled.div`
  cursor: pointer;
`;
