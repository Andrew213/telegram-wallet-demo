import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import {useSystemMessage} from "@/core/context/useSystemMessage";
import {authRoutes} from "@/routes";
import {userError, validators} from "@/utils";

import {useRecoveryCode} from "./hooks/useRecoveryCode";

const Recovery = () => {
  const [email, setEmail] = useState("");

  const [emailError, setEmailError] = useState("");

  const [, setSystemMessage] = useSystemMessage();

  const {t} = useTranslation();

  const navigate = useNavigate();
  const {
    mutate: recover,
    isSuccess,
    error,
    data,
    isPending,
  } = useRecoveryCode();

  useEffect(() => {
    if (
      error?.error_code &&
      error.translatedCodes?.includes(error.error_code)
    ) {
      setSystemMessage(userError(error));
      setEmailError(userError(error));
    }

    if (isSuccess && data.error_code === 0) {
      navigate(`/${authRoutes.resetPassword}`, {
        state: {
          guid: data.data,
          email,
        },
      });
    }
  }, [error, isSuccess, data]);

  useEffect(() => {
    if (email) {
      if (!validators.email(email)) {
        setEmailError(t`enter_valid_email`);
      } else {
        setEmailError("");
      }
    }
  }, [email]);

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <h1 className="mb-4 text-h1 font-h1 text-grey-600 dark:text-dark-text-primary">{t`forget_password`}</h1>
      <p className="mb-6 text-p2 font-p2 text-grey-600 dark:text-dark-text-primary">
        {t`forget_password_subtitle`}
      </p>
      <Input
        value={email}
        onChange={setEmail}
        type="email"
        className="mb-4"
        testId="recovery-email-input"
        label={t`email_placeholder`}
        placeholder={t`email_placeholder`}
        name="email"
        error={emailError}
      />
      <Button
        disabled={!email || !!emailError}
        size="lg"
        color="primary"
        type="button"
        testId="recovery-submit-button"
        loading={isPending}
        className="mt-auto"
        onClick={() => {
          recover({email, t});
        }}>
        {t`recover_label`}
      </Button>
    </div>
  );
};

export default Recovery;
