import {GetInputPaymethods} from "@/api/requests";

import useDepositReducer, {State} from "../../hooks/useDepositReducer";
import ConfigFieldInput from "./ConfigFieldInput";
import ConfigFieldSelect from "./ConfigFieldSelect";

interface Props {
  state: State;
  dispatch: ReturnType<typeof useDepositReducer>["1"];
}

const ConfigFields: React.FC<Props> = props => {
  const {state, dispatch} = props;

  return (
    <>
      {Object.entries(state.payway.config).map(
        ([configFieldKey, configField]) => {
          if (GetInputPaymethods.isPaywayConfigFieldSelect(configField)) {
            return (
              <ConfigFieldSelect
                key={`${state.paymethod.id}-${state.payway.id}-${configFieldKey}`}
                configField={configField}
                configFieldKey={configFieldKey}
                dispatch={dispatch}
              />
            );
          }

          return (
            <ConfigFieldInput
              key={`${state.paymethod.id}-${state.payway.id}-${configFieldKey}`}
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
