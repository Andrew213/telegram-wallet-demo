import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";

export const pathes = {
  signup: "Создание кошелька",
  code: "Вход",
  signin: "Вход",
  recovery: "Восстановление пароля",
  "reset-password": "Восстановление пароля",
  profile: "Профиль",
};

const AuthHeader: React.FC = () => {
  const navigate = useNavigate();
  const {pathname, state} = useLocation();
  const path = pathname.split("/").at(-1) as keyof typeof pathes;
  const {t} = useTranslation();

  useEffect(() => {
    if (!state?.afterSignIn) {
      const handleBackClick = () => {
        navigate(-1);
      };

      Telegram.WebApp.BackButton.onClick(handleBackClick);
      return () => {
        Telegram.WebApp.BackButton.offClick(handleBackClick);
      };
    }
  }, [navigate, path, state?.afterSignIn]);

  return (
    <div
      data-testid="auth-header-container"
      className="sticky top-0 flex items-center justify-center bg-white px-4 py-3 dark:bg-dark-bg dark:text-dark-text-primary">
      <h4
        data-testid="auth-header-text"
        className="mx-auto my-0 text-h4 font-h4">
        {(path === "code" || path === "signin") && t`sign_in_title`}
        {path === "signup" && t`sing_up_create_wallet`}
        {(path === "recovery" || path === "reset-password") &&
          t`forget_password_title`}
        {path === "profile" && t`profile_title`}
      </h4>
    </div>
  );
};

export default AuthHeader;
