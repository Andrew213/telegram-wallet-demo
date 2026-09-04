import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

import StatusPlate from "@/components/StatusPlate/StatusPlate";
import {useOpenLink} from "@/hooks";
import {userError} from "@/utils";

import {type State} from "../hooks/useDepositReducer";
import usePostDeposit from "../hooks/usePostDeposit";

interface Props {
  state: State;
  postDeposit: ReturnType<typeof usePostDeposit>;
}

const PostDepositStatusPlate: React.FC<Props> = props => {
  const {postDeposit} = props;

  const navigate = useNavigate();

  const openLink = useOpenLink();

  const {t} = useTranslation();

  if (postDeposit.isPending) {
    return (
      <StatusPlate
        status="PENDING"
        testId="deposit-pending"
        title={t`deposit_in_processing_screen_title`}
        subTitle={t`deposit_in_processing_screen_subtitle`}
        onButtonClick={() => navigate("/")}
        buttonText={t`back_to_main_label`}
      />
    );
  }

  if (postDeposit.error) {
    return (
      <StatusPlate
        status="ERROR"
        testId="deposit-error"
        title={userError(postDeposit.error)}
        subTitle={t`deposit_failed_screen_subtitle`}
        onButtonClick={() => {
          openLink("mailto:support@example.com");
        }}
        buttonText={t`back_to_main_label`}
      />
    );
  }

  return null;
};

export default PostDepositStatusPlate;
