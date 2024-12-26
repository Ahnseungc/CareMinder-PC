import { CMModal, CMModalProps } from "@components/common";
import addressState from "@libraries/recoil/address";
import { NewAdminUser } from "@models/user";
import DaumPostcodeEmbed, { Address } from "react-daum-postcode";
import { UseFormSetValue } from "react-hook-form";
import { useSetRecoilState } from "recoil";

interface DaumPostModalProps extends CMModalProps {
  setValue: UseFormSetValue<NewAdminUser>;
}

export default function DaumPostModal({ onClose, setValue, ...props }: DaumPostModalProps) {
  const setAddressState = useSetRecoilState(addressState);
  const handleComplete = (data: Address) => {
    /** 도로명 주소 */
    console.log(data.roadAddress);
    /** 우편번호 */
    console.log(data.zonecode);
    setAddressState({
      roadAddress: data.roadAddress,
      zonecode: data.zonecode,
    });

    setValue("postalCode", data.zonecode, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("mainAddress", data.roadAddress, {
      shouldValidate: true,
      shouldDirty: true,
    });

    onClose();
  };
  return (
    <CMModal maxWidth="md" onClose={onClose} {...props}>
      <DaumPostcodeEmbed onComplete={handleComplete} />
    </CMModal>
  );
}
