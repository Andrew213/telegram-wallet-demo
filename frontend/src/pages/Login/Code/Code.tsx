import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import OTPInput from "react-otp-input";
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import sanitizeHtml from "sanitize-html";

import {
  auth2faResponse,
  loginWithCodeResponse,
  signupWithCodeResponse,
} from "@/api/services/AuthService/types";
import {ResponseError} from "@/api/types";
import Button from "@/components/Button/Button";
import PinCode from "@/components/PinCode/PinCode";
import StatusPlate from "@/components/StatusPlate/StatusPlate";
import {
  LS_REFRESH_TOKEN_KEY,
  LS_TOKEN_KEY,
  SS_LOGGED_BY_PIN_KEY,
} from "@/constants";
import {useAuth} from "@/core/context/useAuth";
import {useCloudStorage} from "@/core/context/useCloudStorage";
import {useSystemMessage} from "@/core/context/useSystemMessage";
import {useTimer} from "@/core/context/useTimer";
import {authRoutes} from "@/routes";
import {userError} from "@/utils";
import {setCloudStorage} from "@/utils/cloudStorage";
import {decodeToken} from "@/utils/decodeToken";

import {
  use2faAuth,
  useLoginWithCode,
  useRetryLoginCode,
  useRetrySendCode,
  useSendCode,
} from "./hooks/useMutate";

const Code: React.FC = () => {
  const {
    state: {
      email,
      password,
      codeToken,
      notificationToken,
      guid,
      is2fa,
      afterSignIn,
      device_id,
    },
  } = useLocation();

  const [, setIsLogged] = useAuth();

  const navigate = useNavigate();

  const [, setMessage] = useSystemMessage();

  const [isPincodeOpened, setIsPincodeOpened] = useState(false);

  const [otp, setOtp] = useState("");

  const [success, setSuccess] = useState(false);

  const [_, setToken] = useCloudStorage();

  const [errorCount, setErrorCount] = useState<null | number>(null);

  const {t} = useTranslation();

  const [tokens, setTokens] = useState<{
    refresh_token: string;
    token: string;
  }>();

  const [timer, setTimer] = useTimer();

  let ERROR: ResponseError<number | string> | null = null;

  let isResponseSuccess: boolean = false;

  let responseData:
    | loginWithCodeResponse
    | auth2faResponse
    | signupWithCodeResponse
    | undefined;

  const {
    mutateAsync: sendSignupCode,
    isSuccess,
    data,
    error: errorFromResponse,
    isPending,
  } = useSendCode();

  if (isSuccess) {
    isResponseSuccess = isSuccess;
    responseData = data;
  }

  ERROR = errorFromResponse;

  const {
    mutateAsync: sendLoginCode,
    isSuccess: sendLoginCodeSuccess,
    data: sendLoginCodeData,
    error: sendLoginCodeError,
    isPending: sendLoginCodePending,
  } = useLoginWithCode();
  if (sendLoginCodeSuccess) {
    isResponseSuccess = sendLoginCodeSuccess;
    responseData = sendLoginCodeData;
  }
  if (sendLoginCodeError) {
    ERROR = sendLoginCodeError;
  }

  const {mutateAsync: retrySignupCode, isSuccess: sendSignupCodeSuccess} =
    useRetrySendCode();

  const {mutateAsync: retryLoginCode, isSuccess: sendRetryLoginCodeSuccess} =
    useRetryLoginCode();

  const {
    mutateAsync: auth2fa,
    isSuccess: auth2faSuccess,
    data: auth2faData,
    isPending: auth2faPenfing,
    error: auth2faError,
  } = use2faAuth();

  if (auth2faSuccess) {
    isResponseSuccess = auth2faSuccess;
    responseData = auth2faData;
  }
  if (auth2faError) {
    ERROR = auth2faError;
  }

  useEffect(() => {
    if (afterSignIn && !isPincodeOpened) {
      const handleBackClick = () => {
        navigate(-1);
      };

      Telegram.WebApp.BackButton.onClick(handleBackClick);
      return () => {
        Telegram.WebApp.BackButton.offClick(handleBackClick);
      };
    }
  }, [navigate, afterSignIn, isPincodeOpened]);

  useEffect(() => {
    if (sendSignupCodeSuccess || sendRetryLoginCodeSuccess) {
      setTimer(60);
    }
  }, [sendSignupCodeSuccess, sendRetryLoginCodeSuccess, setTimer]);

  useEffect(() => {
    if (ERROR?.translatedCodes?.includes(ERROR.error_code)) {
      setErrorCount(ERROR.data);
      setOtp("");
      if (
        ERROR.error_code === 1021 ||
        ERROR.error_code === 1022 ||
        ERROR.error_code === 1011
      ) {
        navigate(`/${authRoutes.login}`, {replace: true});
      }
      return;
    }

    if (isSuccess && data.error_code === 0) {
      setSuccess(true);
      return;
    }

    if (isResponseSuccess && responseData?.data) {
      if ("data" in responseData && typeof responseData.data !== "string") {
        if ("refresh_token" in responseData.data) {
          setTokens({
            refresh_token: responseData.data.refresh_token,
            token: decodeToken(responseData.data.token),
          });
          setIsPincodeOpened(true);
        }
      }
    }
  }, [
    isResponseSuccess,
    responseData,
    ERROR?.error_code,
    setMessage,
    navigate,
    sendLoginCodeData,
    ERROR?.translatedCodes,
    ERROR?.message,
    ERROR?.data,
    isSuccess,
    data?.error_code,
  ]);

  const onEnter = () => {
    if (guid) {
      if (is2fa) {
        auth2fa({
          guid,
          email,
          password,
          device_id: device_id || "",
          gcode: otp,
          t,
        }).catch(err => setMessage(userError(err)));
      } else {
        sendSignupCode({guid, code: otp, t}).catch(err => {
          setMessage(userError(err));
          setOtp("");
        });
      }
    }
    if (codeToken && notificationToken && email && password) {
      sendLoginCode({
        password,
        email,
        guid: codeToken,
        code: otp,
        device_id: device_id || "",
        t,
      }).catch(err => setMessage(userError(err)));
    }
  };

  const handleOnPinCodeSaved = async () => {
    if (tokens) {
      await setCloudStorage(LS_REFRESH_TOKEN_KEY, tokens.refresh_token);
      await setCloudStorage(LS_TOKEN_KEY, tokens.token);
      setToken(tokens.token);
      sessionStorage.setItem(SS_LOGGED_BY_PIN_KEY, "true");
      setIsLogged(true);
    }
  };

  const subtitleEmail = t("confirmation_by_email_subtitle", {
    email,
  });

  const emailConfirmedSubtitle = t("email_confirmed_subtitle", {
    email,
  });

  if ((!email || !password) && codeToken && notificationToken) {
    return <Navigate to={{pathname: `/${authRoutes.login}`}} replace />;
  }

  return (
    <div className="flex h-full flex-col">
      <h1
        data-testid="code-title-heading"
        className="mb-4 text-h1 font-h1 text-grey-600 dark:text-dark-text-primary">
        {is2fa ? t`google_2fa_title` : t`confirmation_by_email_title`}
      </h1>
      <p
        data-testid="code-subtitle-text"
        className="mb-6 break-words text-p2 font-p2 dark:text-dark-text-primary">
        {is2fa ? (
          t`google_2fa_subtitle`
        ) : (
          <p
            className="whitespace-pre-line"
            dangerouslySetInnerHTML={{__html: sanitizeHtml(subtitleEmail)}}
          />
        )}
      </p>
      <OTPInput
        numInputs={6}
        onChange={setOtp}
        value={otp}
        containerStyle="flex items-center justify-center gap-4"
        shouldAutoFocus
        renderInput={(props, index) => (
          <div className="flex h-16 w-11 items-center justify-center rounded-4 bg-grey-200 dark:bg-dark-surface">
            <input
              data-testid={`code-character-${index + 1}-input`}
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
          data-testid="code-error-count-text"
          className="mb-4 mt-2 max-w-60 text-p3 font-p3 text-red-300 dark:text-dark-red-text">
          {t("invalid_code_with_attempts", {attempt: errorCount})}
        </p>
      )}

      {!is2fa && (
        <>
          {timer ? (
            <p
              data-testid="code-timer-text"
              className="py-4 text-grey-600 dark:text-dark-text-primary">
              {t("resend_code_title", {seconds: timer})}
            </p>
          ) : (
            <Button
              size="sm"
              color="transparent"
              testId="code-resend-button"
              onClick={() => {
                if (guid) {
                  retrySignupCode(guid).catch(err => {
                    setMessage(userError(err));
                  });
                }
                if (codeToken && notificationToken) {
                  retryLoginCode({
                    guid: codeToken,
                    noticeGuid: notificationToken,
                  }).catch(err => {
                    setMessage(userError(err));
                  });
                }
              }}
              className="mr-auto py-4 pl-0 text-blue-300">
              {t`resent_code_label`}
            </Button>
          )}
        </>
      )}

      <Button
        disabled={otp.length !== 6}
        loading={isPending || sendLoginCodePending || auth2faPenfing}
        size="lg"
        testId="code-sign-in-button"
        onClick={onEnter}
        color="primary"
        className="bottom-4 mt-auto">
        {t`sign_in_label`}
      </Button>
      {isPincodeOpened && <PinCode onSuccess={handleOnPinCodeSaved} />}
      {success && (
        <StatusPlate
          testId="code"
          status="SUCCESS"
          title={t`email_confirmed_title`}
          subTitle={
            <p
              className="whitespace-pre-line dark:text-dark-text-secondary"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(emailConfirmedSubtitle),
              }}
            />
          }
          buttonText={t`sign_in_label`}
          onButtonClick={() => {
            navigate(`/${authRoutes.signin}`, {replace: true});
          }}
        />
      )}
    </div>
  );
};

export default Code;
