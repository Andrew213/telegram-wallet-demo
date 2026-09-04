import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

import Button from "@/components/Button/Button";
import {DEFAULT_LANGUAGE} from "@/constants";
import {authRoutes} from "@/routes";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const {t, i18n} = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(DEFAULT_LANGUAGE);
  }, []);

  return (
    <div className="flex h-full flex-col justify-end">
      <h1 className="mb-4 text-h0 font-h0 text-grey-600 dark:text-dark-text-primary">{t`welcome_title`}</h1>
      <p className="text-p2 font-p2 text-grey-600 dark:text-dark-text-primary">{t`welcome_subtitle`}</p>
      <div className="mt-8 flex flex-col gap-[13px]">
        {import.meta.env?.VITE_DISABE_SIGNUP !== "true" && (
          <Button
            size="lg"
            color="primary"
            testId="login-create-wallet-button"
            onClick={() => {
              navigate(`/${authRoutes.signup}`);
            }}>
            {t`create_wallet_label`}
          </Button>
        )}
        <Button
          size="lg"
          color="secondary"
          testId="login-sign-in-button"
          onClick={() => {
            navigate(`/${authRoutes.signin}`);
          }}>
          {t`sign_in_label`}
        </Button>
      </div>
    </div>
  );
};

export default Login;
