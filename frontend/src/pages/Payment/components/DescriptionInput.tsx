import {useTranslation} from "react-i18next";

import Input from "@/components/Input/Input";
import WithLabel from "@/pages/ui/WithLabel";

import type {Dispatch, State} from "../hooks/usePaymentReducer";

interface Props {
  state: State;
  dispatch: Dispatch;
}

const DescriptionInput: React.FC<Props> = props => {
  const {state, dispatch} = props;

  const {t} = useTranslation();

  return (
    <WithLabel label={t`comment_title`}>
      <Input
        testId="payment-description-input"
        value={state.description}
        onChange={v => {
          dispatch({
            type: "ChangeDescription",
            payload: v,
          });
        }}
        placeholder={t`comment_placeholder`}
        type="text"
        bgColor="white dark:bg-dark-bg"
      />
    </WithLabel>
  );
};

export default DescriptionInput;
