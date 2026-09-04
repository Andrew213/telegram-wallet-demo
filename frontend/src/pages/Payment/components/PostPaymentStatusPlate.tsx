import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

import {PostPayment} from "@/api/requests";
import StatusPlate from "@/components/StatusPlate/StatusPlate";

import usePostPayment from "../hooks/usePostPayment";

interface Props {
  postPayment: ReturnType<typeof usePostPayment>;
}

const PostPaymentStatusPlate: React.FC<Props> = props => {
  const {postPayment} = props;

  const navigate = useNavigate();

  const {t} = useTranslation();

  if (postPayment.isPending) {
    return (
      <StatusPlate
        status="PENDING"
        testId="payment-transfer-pending"
        title={t`transfer_in_processing_screen_title`}
        subTitle={t`transfer_in_processing_screen_subtitle`}
        onButtonClick={() => navigate("/")}
        buttonText={t`back_to_main_label`}
      />
    );
  }

  const error = postPayment.error as PostPayment.ResponseError | null;
  if (
    error &&
    error.error_code !== PostPayment.errorNameToErrorCodeMap.invalidGcode
  ) {
    return (
      <StatusPlate
        status="ERROR"
        testId="payment-transfer-error"
        title={t`error_boundary_title`}
        onButtonClick={() => navigate("/")}
      />
    );
  }

  if (postPayment.isSuccess) {
    return (
      <StatusPlate
        status="SUCCESS"
        testId="payment-transfer-success"
        title={t`main_currency_card_payout`}
        subTitle={""}
        onButtonClick={() => navigate("/")}
        buttonText={t`back_to_main_label`}
      />
    );
  }

  return null;
};

export default PostPaymentStatusPlate;
