import {TFunction} from "i18next";
import {useTranslation} from "react-i18next";
import {useLocation} from "react-router-dom";

import {useHideHeaderContext} from "@/core/context/useHideHeader";
import {authRoutes, type TRoutePath} from "@/routes";

import AuthHeader from "../AuthHeader/AuthHeader";
import UserHeader from "../UserHeader/UserHeader";

const pathes = (t: TFunction) => ({
  "/deposit": t`deposit_title`,
  "/payment": t`transfer_screen_header_title`,
  "/bills": t`bills_screen_title`,
  "/history": t`history_screen_title`,
});

const Header: React.FC = () => {
  const [hide] = useHideHeaderContext();

  const pathname = useLocation().pathname as TRoutePath;

  const {t} = useTranslation();

  if (hide) {
    return null;
  }

  if (pathname === "/") {
    return <UserHeader />;
  }
  if (pathname === `/${authRoutes.profile}`) {
    return <AuthHeader />;
  }

  const bg =
    pathname === "/history"
      ? "grey-100 dark:bg-dark-underlay"
      : "white dark:bg-dark-bg";
  return (
    <div
      className={`rounded-b-8 bg-${bg} px-4 py-3 text-center text-h4 font-h4 text-grey-600 dark:text-dark-text-primary`}>
      {pathes(t)[pathname]}
    </div>
  );
};

export default Header;
