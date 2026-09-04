import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import OTPInput from "react-otp-input";
import {useLocation, useNavigate} from "react-router-dom";
import sanitizeHtml from "sanitize-html";

import Button from "@/components/Button/Button";
import InputPassword from "@/components/InputPassword/InputPassword";
import StatusPlate from "@/components/StatusPlate/StatusPlate";
import {useSystemMessage} from "@/core/context/useSystemMessage";
import {useTimer} from "@/core/context/useTimer";
import {authRoutes} from "@/routes";
import {userError} from "@/utils";

import {useRecoveryWithCode} from "./hooks/useRecoveryWithCode";
import {useRetryRecoveryWithCode} from "./hooks/useRetryRecoveryWithCode";

const ResetPassword: React.FC = () => {
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [password, setPassword] = useState("");

  const [code, setCode] = useState("");

  const {state} = useLocation();

  const navigate = useNavigate();

  const {mutateAsync: recover, isPending} = useRecoveryWithCode();

  const {mutateAsync: retryRecover} = useRetryRecoveryWithCode();

  const [success, setSuccess] = useState(false);

  const [timer, setTimer] = useTimer();

  const [, setMessage] = useSystemMessage();

  const {t} = useTranslation();

  const [errorCount, setErrorCount] = useState(null);

  useEffect(() => {
    if (!state.guid) {
      navigate(-1);
    }
  }, [state]);

  const handleOnSubmit = async () => {
    if (state.guid) {
      recover({
        password,
        guid: state.guid,
        code,
        t,
      })
        .then(resp => {
          if (resp.error_code === 0) {
            if (timer) {
              setTimer(0);
            }
            setSuccess(true);
          }
        })
        .catch(err => {
          if (err.translatedCodes.includes(err.error_code)) {
            setMessage(userError(err));
            if (err.error_code === 1020) {
              setCode("");
              setErrorCount(err.data);
            }
          }
          if (err.error_code === 1021 || err.error_code === 1022) {
            navigate(`/${authRoutes.login}`, {replace: true});
          }
        });
    }
  };

  const handleOnRetryRecover = async () => {
    if (state.guid) {
      retryRecover({guid: state.guid}).then(resp => {
        if (resp.error_code === 0) {
          setTimer(60);
        }
      });
    }
  };

  return (
    <div className="flex h-full flex-col">
      <p
        className="mb-4 text-h4 font-h4 text-grey-600 dark:text-dark-text-primary"
        data-testid="recovery-password-title">
        {t`recovery_password_main_title`}
      </p>
      <div className="mb-8">
        <InputPassword
          testId="recovery-password-input"
          value={password}
          onChange={setPassword}
          getIsValid={isValid => setIsPasswordValid(isValid)}
        />
      </div>

      <p className="mb-4 text-h4 font-h4 dark:text-dark-text-primary">{t`recovery_password_main_title`}</p>
      <p
        className="mb-6 whitespace-pre-line text-p2 font-p2 dark:text-dark-text-primary"
        data-testid="recovery-password-subtitle"
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(
            t("recovery_password_subtitle", {email: state.email}),
          ),
        }}
      />
      <OTPInput
        numInputs={6}
        onChange={setCode}
        value={code}
        containerStyle="flex items-center justify-center gap-4"
        shouldAutoFocus
        renderInput={(props, index) => (
          <div className="flex h-16 w-11 items-center justify-center rounded-4 bg-grey-200 dark:bg-dark-surface">
            <input
              data-testid={`recovery-password-code-input-${index + 1}`}
              {...props}
              className="block w-[0.6em] dark:text-dark-text-primary"
              type="tel"
              inputMode="tel"
              placeholder="0"
            />
          </div>
        )}
      />

      {errorCount !== null && (
        <p
          className="mb-4 mt-2 max-w-60 text-p3 font-p3 text-red-300 dark:text-dark-red-text"
          data-testid="recovery-password-error-attempts">
          {t("invalid_code_with_attempts", {attempt: errorCount})}
        </p>
      )}
      <div className="mb-6 pt-4 text-p1 font-p1">
        {timer ? (
          <p
            className="text-grey-600 dark:text-dark-text-primary"
            data-testid="recovery-password-timer">
            {t("resend_code_title", {seconds: timer})}
          </p>
        ) : (
          <button
            data-testid="recovery-password-resend-button"
            onClick={handleOnRetryRecover}
            className="mr-auto p-0 text-blue-300">
            {t`resent_code_label`}
          </button>
        )}
      </div>

      <Button
        disabled={!isPasswordValid || code.length !== 6}
        size="lg"
        color="primary"
        testId="recovery-password-submit-button"
        onClick={handleOnSubmit}
        loading={isPending}
        className="mt-auto">
        {t`confirm_label`}
      </Button>
      {success && (
        <StatusPlate
          testId="recovery"
          status="SUCCESS"
          title={t`password_confirmed_title`}
          buttonText={t`back_to_main_label`}
          onButtonClick={() => {
            navigate(`/${authRoutes.login}`);
            setSuccess(false);
          }}
          subTitle={
            <p className="text-p2 font-p2 text-grey-600 dark:text-dark-text-primary">
              {t`password_confirmed_subtitle`}
            </p>
          }
        />
      )}
    </div>
  );
};

export default ResetPassword;
