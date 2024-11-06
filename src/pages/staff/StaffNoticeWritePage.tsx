import { Box, Stack, Typography, styled } from "@mui/material";
import { AdminTable } from "@components/admin";
import CButton from "@components/common/atom/C-Button";
// import PaginationComponent from "@components/common/pagination";
import AdminNoticeWriteForm from "@components/admin/adminNotice/adminNoticeWriteForm";
import useGetWardTabletRequests from "@hooks/queries/useGetStaffsTablet";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { NoticeReqType } from "@models/notice";
import useCreateNotice from "@hooks/mutation/useCreateNotice";
import Cookies from "js-cookie";
import CSwitch from "@components/common/atom/C-Switch";
import { toast } from "react-toastify";

const StaffNoticeWritePage = () => {
  //@ts-ignore
  const [searchValue, setSearchValue] = useState<string>("");
  const token = Cookies.get("accessTokenStaff") as string;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isMyArea, setIsMyArea] = useState<boolean>(false);
  //@ts-ignore
  const { data: getTablet, isLoading } = useGetWardTabletRequests({
    token: token,
    patientName: searchValue,
    myArea: isMyArea,
  });

  //@ts-ignore
  const { mutate, isPending } = useCreateNotice();

  const [selected, setSelected] = useState<
    Array<{
      name: string;
      id: number;
    }>
  >([]);
  const [fileUrl, setFileUrl] = useState<Array<{ name: string; url: string }>>([]);

  const handleFileUploadUrl = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileUrl(prev => [...prev, { name: file.name, url: reader.result as string }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUploadUrlDelete = (index: number) => {
    setFileUrl(prev => prev.filter((_, i) => i !== index));
  };

  const handleRecipientDelete = (index: number) => {
    setSelected(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const onChangeSelected = (tabletId: number, patientName: string) => {
    setSelected(prev => {
      if (prev.some(item => item.id === tabletId)) {
        return prev.filter(item => item.id !== tabletId);
      } else {
        return [...prev, { name: patientName, id: tabletId }];
      }
    });
  };
  const onChangeMyArea = () => {
    setIsMyArea(prev => !prev);
  };

  console.log(selected);

  useEffect(() => {
    setSelected([]);
  }, [isMyArea]);

  const defaultValuesUpdate: NoticeReqType = {
    wardId: 0,
    title: "",
    content: "",
    fileUrl: "",
    recipientIds: [],
  };

  const formNotice = useForm<NoticeReqType>({
    defaultValues: defaultValuesUpdate,
    mode: "onChange",
  });

  const { handleSubmit: handleFormNotice } = formNotice;

  const onSubmit: SubmitHandler<NoticeReqType> = data => {
    const updatedData = {
      ...data,
      wardId: selected[0].id,
      recipientIds: selected.map(item => item.id),
      // fileUrl: fileUrl[0].url,
      fileUrl: "테스트중이라 임시",
    };

    mutate(updatedData, {
      onSuccess: () => {
        toast.success("공지 전송이 완료 되었습니다.");
      },
      onError: error => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Container>
      <div>
        <Title variant="h1">공지</Title>
        <AdminInoutSubTitleContainer>
          <AdminInoutSubTitleLeftContainer>
            <Subtitle variant="h2">내 구역 테블릿 리스트</Subtitle>
            <div>
              <CSwitch onChange={onChangeMyArea} />
            </div>
          </AdminInoutSubTitleLeftContainer>
          <AdminInoutSubTitleRightContainer>
            <ButtonLayout width={"148px"}>
              <CButton buttontype={"primarySpaure"} onClick={handleFormNotice(onSubmit)}>
                공지 작성
              </CButton>
            </ButtonLayout>
          </AdminInoutSubTitleRightContainer>
        </AdminInoutSubTitleContainer>
      </div>
      <TableLayout>
        <AdminNoticeListLayout>
          <AdminTable
            getTablet={getTablet}
            onChangeSelected={onChangeSelected}
            selected={selected}
          />
        </AdminNoticeListLayout>
        <AdminNoticeWriteForm
          handleRecipientDelete={handleRecipientDelete}
          form={formNotice}
          fileUrl={fileUrl}
          selected={selected}
          handleFileUploadClick={handleFileUploadClick}
          fileRef={fileInputRef}
          handleFileUploadUrl={handleFileUploadUrl}
          handleFileUploadUrlDelete={handleFileUploadUrlDelete}
        />
      </TableLayout>
      <FooterLayout>{/* <PaginationComponent totalPage={5} /> */}</FooterLayout>
    </Container>
  );
};

export default StaffNoticeWritePage;

/** styles */

const Container = styled(Stack)({
  height: "100%",
  paddingBottom: "78px",
});

const AdminInoutSubTitleContainer = styled(Box)({
  marginTop: "17.66px",
  display: "flex",
  justifyContent: "space-between",
});

const AdminNoticeListLayout = styled(Box)({
  width: "50%",
  height: "100%",
});

const AdminInoutSubTitleLeftContainer = styled(Box)({
  display: "flex",
  width: "50%",
  gap: "20px",
  alignItems: "center",
});
const AdminInoutSubTitleRightContainer = styled(Box)({
  display: "flex",
  width: "50%",
  alignItems: "center",
  gap: "15.66px",

  justifyContent: "end",
});
const ButtonLayout = styled(Box)(width => ({
  width: `${width}`,
}));
// const ButtonListLayout = styled(Box)({
//   display: "flex",
//   gap: "10px",
// });
const TableLayout = styled(Box)({
  marginTop: "40px",
  display: "flex",
  gap: "24px",
  height: "100%",
  maxHeight: "647px",
});

const FooterLayout = styled(Box)({
  paddingTop: "61.27px",
  // paddingBottom: "48.73px",
  display: "flex",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
});

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  textTransform: "uppercase",
  lineHeight: "24px",
  letterSpacing: "-3%",
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  lineHeight: "26px",
  fontSize: "18px",
  fontWeight: 500,
  color: theme.palette.primary.dark,
}));

// const SectionArrayLayout = styled(Box)({
//   display: "flex",
//   alignItems: "center",
//   gap: "5px",
// });
