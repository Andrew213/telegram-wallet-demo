import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

import AuthQueryMethods from "@/api/services/AuthService/query";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import {useSystemMessage} from "@/core/context/useSystemMessage";
import {authRoutes} from "@/routes";
import {formatStringToUuid, userError, validators} from "@/utils";

import {useLogin} from "./hooks/useLogin";

const SignIn: React.FC = () => {
  const [emailError, setEmailError] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [, setSystemMessage] = useSystemMessage();

  const {mutateAsync: login, isPending} = useLogin();

  const {t} = useTranslation();

  const handleSubmit = () => {
    const device_id = window.Telegram.WebApp.BiometricManager.deviceId;

    formatStringToUuid(device_id).then(deviceId => {
      login({device_id: deviceId, email, password, t})
        .then(res => {
          if (res.error_code === 0) {
            const codeToken = res.data.code_token;
            const notificationToken = res.data.notification_token;
            navigate(
              {
                pathname: `/${authRoutes.code}`,
              },
              {
                state: {
                  device_id: deviceId,
                  email,
                  password,
                  codeToken,
                  notificationToken,
                },
              },
            );
          }
        })
        .catch(error => {
          if (error?.error_code === AuthQueryMethods.authErrors.AUTH_2FA) {
            navigate(`/${authRoutes.code}`, {
              state: {
                is2fa: true,
                device_id: deviceId,
                guid: error.data.token,
                email,
                password,
                afterSignIn: true,
              },
            });
            return;
          }

          setSystemMessage(userError(error));
        });
    });
  };

  return (
    <>
      <div className="flex h-full flex-col">
        <h1 className="mb-8 text-h1 font-h1 text-grey-600 dark:text-dark-text-primary">{t`sign_in_welcome_title`}</h1>

        <div>
          <Input
            value={email}
            label={t`email_placeholder`}
            placeholder={t`email_placeholder`}
            type="email"
            name="email"
            testId="sign-in-email-input"
            autoComplete="username"
            containerClassName="mb-4"
            error={emailError}
            onChange={setEmail}
            onBlur={() => {
              if (!validators.email(email)) {
                setEmailError(t`enter_valid_email`);
              } else {
                setEmailError("");
              }
            }}
            onSubmit={e => {
              e.preventDefault();
              setSystemMessage(JSON.stringify(e));
            }}
          />
          <Input
            value={password}
            label={t`password_placeholder`}
            placeholder={t`password_placeholder`}
            onChange={setPassword}
            type="password"
            testId="sign-in-password-input"
            containerClassName="mb-4"
            autoComplete="current-password"
          />
          {import.meta.env?.VITE_DISABE_RESET_PASSWORD !== "true" && (
            <Button
              color="transparent"
              testId="sign-in-forgot-password-button"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/${authRoutes.recovery}`);
              }}
              size="sm"
              className="p-0 text-blue-200">
              {t`forget_password`}
            </Button>
          )}
        </div>
        <Button
          disabled={!email || !password || !!emailError}
          color="primary"
          testId="sign-in-login-button"
          size="lg"
          loading={isPending}
          className="mt-auto"
          onClick={handleSubmit}>
          {t`sign_in_label`}
        </Button>
      </div>
    </>
  );
};

export default SignIn;
