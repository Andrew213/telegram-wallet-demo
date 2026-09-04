import {GetOutputPaymethods} from "@/api/requests";

import type {Dispatch, State} from "../../hooks/usePaymentReducer";
import ConfigFieldInput from "./ConfigFieldInput";
import ConfigFieldSelect from "./ConfigFieldSelect";

interface Props {
  state: State;
  dispatch: Dispatch;
}

const ConfigFields: React.FC<Props> = props => {
  const {state, dispatch} = props;

  return (
    <>
      {Object.entries(state.payway.config).map(
        ([configFieldKey, configField]) => {
          if (GetOutputPaymethods.isPaywayConfigFieldSelect(configField)) {
            return (
              <ConfigFieldSelect
                key={`${state.paymethod.id}-${state.payway.id || state.payway.currency}-${configFieldKey}`}
                configField={configField}
                configFieldKey={configFieldKey}
                dispatch={dispatch}
              />
            );
          }

          return (
            <ConfigFieldInput
              key={`${state.paymethod.id}-${state.payway.id || state.payway.currency}-${configFieldKey}`}
              configField={configField}
              configFieldKey={configFieldKey}
              dispatch={dispatch}
            />
          );
        },
      )}
    </>
  );
};

export default ConfigFields;
