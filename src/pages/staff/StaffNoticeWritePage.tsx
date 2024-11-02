import { Box, Stack, Typography, styled } from "@mui/material";
import { AdminTable } from "@components/admin";

import CButton from "@components/common/atom/C-Button";

import PaginationComponent from "@components/common/pagination";
import AdminNoticeWriteForm from "@components/admin/adminNotice/adminNoticeWriteForm";
import useGetWardTabletRequests from "@hooks/queries/useGetStaffsTablet";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
import { NoticeType } from "@models/notice";
import useCreateNotice from "@hooks/mutation/useCreateNotice";
import Cookies from "js-cookie";
import CSwitch from "@components/common/atom/C-Switch";

const StaffNoticeWritePage = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const token = Cookies.get("accessTokenStaff") as string;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isMyArea, setIsMyArea] = useState<boolean>(false);
  //@ts-ignore
  const { data: getTablet, isLoading } = useGetWardTabletRequests({
    token: token,
    searchValue: searchValue,
    myArea: isMyArea,
  });

  //@ts-ignore
  const { mutate, isPending } = useCreateNotice();

  const [selected, setSelected] = useState<Array<number>>([]);

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const onChangeSelected = (tabletId: number) => {
    setSelected(prev => {
      if (prev.some(item => item === tabletId)) {
        return prev.filter(item => item !== tabletId);
      } else {
        return [...prev, tabletId];
      }
    });
  };
  const onChangeMyArea = () => {
    setIsMyArea(prev => !prev);
  };

  useEffect(() => {
    formNotice.setValue("wardId", selected[0]);
  }, [selected]);

  const defaultValuesUpdate: NoticeType = {
    id: 0,
    wardId: 0,
    title: "",
    content: "",
    fileUrl: [],
    createdAt: "",
    lastModifiedAt: "",
  };

  const formNotice = useForm<NoticeType>({
    defaultValues: defaultValuesUpdate,
    mode: "onChange",
  });

  // const { handleSubmit: handleDischarge } = formDischarge;

  // const onSubmit: SubmitHandler<NoticeType> = data => {
  //   mutate(data, {
  //     onSuccess: () => {
  //       toast.success("퇴원 처리가 완료 되었습니다.");
  //     },
  //     onError: error => {
  //       toast.error(error.message);
  //     },
  //   });
  // };

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
              <CButton
                buttontype={"primarySpaure"}
                onClick={() => {
                  console.log(formNotice.getValues());
                }}
              >
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
          form={formNotice}
          handleFileUploadClick={handleFileUploadClick}
          fileRef={fileInputRef}
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

const SectionArrayLayout = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "5px",
});
