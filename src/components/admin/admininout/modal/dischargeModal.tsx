import { CMModal, CMModalProps, ModalActionButton } from "@components/common";

interface ChargeModalProps extends Omit<CMModalProps, "title"> {
  onConfirm: () => void;
  modalTitle: string;
  subTitle: string | React.ReactNode;
  rightText: string;
}

const DischargeModal = ({
  onClose,
  onConfirm,
  modalTitle,
  subTitle,
  rightText,
  ...props
}: ChargeModalProps) => {
  return (
    <CMModal
      maxWidth="sm"
      onClose={onClose}
      title={modalTitle}
      footer={
        <>
          <ModalActionButton color="secondary" onClick={onClose}>
            취소
          </ModalActionButton>
          <ModalActionButton onClick={() => null}>{rightText}</ModalActionButton>
        </>
      }
      {...props}
    ></CMModal>
  );
};

export default DischargeModal;
