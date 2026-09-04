import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import Input from "@/components/Input/Input";
import InputPassword from "@/components/InputPassword/InputPassword";
import {useSystemMessage} from "@/core/context/useSystemMessage";
import {authRoutes} from "@/routes";
import {userError, validators} from "@/utils";

import useSignUp from "./hooks/useSignUp";

const SignUp = () => {
  const [email, setEmail] = useState("");

  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");

  const [, setSystemMessage] = useSystemMessage();

  const [agreement, setAgreement] = useState(false);

  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const navigate = useNavigate();

  const {mutateAsync: signup, isSuccess, data, isPending} = useSignUp();

  const {t} = useTranslation();

  useEffect(() => {
    if (isSuccess && data?.error_code === 0) {
      navigate(
        {
          pathname: `/${authRoutes.code}`,
        },
        {
          state: {
            email,
            guid: data.data,
          },
        },
      );
    }
  }, [data, email, isSuccess, navigate]);

  const handleSubmit = () => {
    signup({email, password, agreement, t}).catch(error => {
      setSystemMessage(userError(error));
    });
  };

  return (
    <div className="flex h-full flex-col">
      <h1 className="mb-8 text-h1 font-h1 dark:text-dark-text-primary">{t`welcome_title`}</h1>
      <div className="mb-6">
        <p className="mb-4 text-h4 font-h4 text-grey-600 dark:text-dark-text-primary">{t`sign_up_email_input_title`}</p>
        <Input
          value={email}
          type="email"
          name="email"
          testId="sign-up-email-input"
          error={emailError}
          onChange={setEmail}
          label={t`email_placeholder`}
          placeholder={t`email_placeholder`}
          onBlur={() => {
            if (!validators.email(email)) {
              setEmailError(t`enter_valid_email`);
            } else {
              setEmailError("");
            }
          }}
        />
      </div>

      <p className="mb-4 text-h4 font-h4 text-grey-600 dark:text-dark-text-primary">{t`sign_up_password_input_title`}</p>
      <InputPassword
        value={password}
        name="password"
        testId="sign-up-password-input"
        onChange={setPassword}
        getIsValid={isValid => setIsPasswordValid(isValid)}
      />

      <div className="mt-auto w-full">
        <div className="mb-6 mt-10">
          <label className="flex items-center gap-2">
            <Checkbox
              size="sm"
              testId="sign-up-agreement-checkbox"
              inputProps={{
                checked: agreement,
                onChange: () => {
                  setAgreement(!agreement);
                },
              }}
            />

            <p className="text-p3 font-p3 dark:text-dark-text-primary">
              {t`sign_up_confirmation_title`}{" "}
              <a
                data-testid="sign-up-terms-link"
                className="inline-block text-blue-300"
                href="#demo-user-agreement"
                target="_blank"
                rel="noreferrer">
                {t`sign_up_term_of_use_title`}
              </a>
            </p>
          </label>
        </div>
        <Button
          size="lg"
          testId="sign-up-create-wallet-button"
          disabled={
            !agreement ||
            !!emailError ||
            !email ||
            !password ||
            !isPasswordValid
          }
          color="primary"
          loading={isPending}
          onClick={handleSubmit}>
          {t`create_wallet_label`}
        </Button>
      </div>
    </div>
  );
};

export default SignUp;
