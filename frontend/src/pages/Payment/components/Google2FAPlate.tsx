import {useState} from "react";
import {useTranslation} from "react-i18next";
import OTPInput from "react-otp-input";

import {PostPayment} from "@/api/requests";
import Button from "@/components/Button/Button";
import SidePlate from "@/components/SidePlate/SidePlate";

interface Props {
  errorCode: PostPayment.ErrorCode | undefined;
  close: () => void;
  submit: (code: string) => void;
}

const Google2FAPlate: React.FC<Props> = props => {
  const {errorCode, close: closeFromProps, submit} = props;

  const [code, setCode] = useState("");

  const {t} = useTranslation();

  return (
    <SidePlate
      testId="payment-google-2fa"
      close={closeFromProps}
      bgColor="white">
      {close => (
        <>
          <SidePlate.Header testId="payment-google-2fa" close={close} />
          <div className="flex flex-grow flex-col px-4 pb-4 pt-8">
            <h1 className="mb-4 text-h1 font-h1 dark:text-dark-text-primary">
              {t`google_2fa_title`}
            </h1>
            <p className="mb-6 text-p2 font-p2 dark:text-dark-text-primary">
              {t`google_2fa_subtitle`}
            </p>
            <OTPInput
              numInputs={6}
              onChange={setCode}
              value={code}
              containerStyle="flex items-center justify-center gap-4"
              shouldAutoFocus
              renderInput={(props, i) => (
                <div className="flex h-16 w-11 items-center justify-center rounded-4 bg-grey-200 dark:bg-dark-surface">
                  <input
                    {...props}
                    data-testid={`payment-google-2fa-input-code-${i}`}
                    className="block w-[0.6em]"
                    type="tel"
                    inputMode="tel"
                    placeholder="0"
                  />
                </div>
              )}
            />
            {errorCode && (
              <p
                data-testid="payment-google-2fa-error-text"
                className="mb-4 mt-2 max-w-60 text-p3 font-p3 text-red-300 dark:text-dark-red-text">
                {PostPayment.errorCodeToErrorNameMap(t)[errorCode]}
              </p>
            )}
            <div className="flex flex-grow flex-col-reverse">
              <Button
                size="lg"
                color="primary"
                onClick={() => submit(code)}
                disabled={code.length !== 6}
                testId="payment-google-2fa-confirm-button"
                className="mt-auto">
                {t`confirm_label`}
              </Button>
            </div>
          </div>
        </>
      )}
    </SidePlate>
  );
};

export default Google2FAPlate;
