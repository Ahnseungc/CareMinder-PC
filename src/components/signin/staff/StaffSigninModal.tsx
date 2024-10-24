import { CMModal, CMModalProps } from "@components/common";
import SigninLayout from "@components/signin/SigninLayout";

export default function StaffSigninModal(props: CMModalProps) {
  console.log(props);
  return (
    <CMModal {...props} maxWidth="sm">
      <SigninLayout type={"STAFF"} reqType="STAFF" />
    </CMModal>
  );
}
