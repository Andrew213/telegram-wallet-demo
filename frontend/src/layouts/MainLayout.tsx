import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {twMerge} from "tailwind-merge";

import {GetBills} from "@/api/requests";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import Spiner from "@/components/Spiner/Spiner";
import StatusPage from "@/components/StatusPage/StatusPage";
import {AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE} from "@/constants";
import {useAuth} from "@/core/context/useAuth";
import {useCloudStorage} from "@/core/context/useCloudStorage";
import {useTheme} from "@/core/context/useTheme";
import {useOpenLink} from "@/hooks";
import useSafePaddingTop from "@/hooks/useSafePaddingTop";
import useGetAccount from "@/pages/hooks/useGetAccount";
import useGetBills from "@/pages/hooks/useGetBills";
import {authRoutes, routes} from "@/routes";

const MainLayout: React.FC = () => {
  const [isLogged] = useAuth();
  const openLink = useOpenLink();

  const [token] = useCloudStorage();

  const [{isDark}] = useTheme();

  useGetBills(token, {status: GetBills.statusNameToStatusCodeMap.Waiting});

  const {pathname} = useLocation();

  const {t, i18n} = useTranslation();

  const {isLoading, error, data} = useGetAccount(token);

  const safePaddingTop = useSafePaddingTop();
  useEffect(() => {
    if (data?.default_lang) {
      if (AVAILABLE_LANGUAGES.includes(data.default_lang)) {
        i18n.changeLanguage(data.default_lang);
      } else {
        i18n.changeLanguage(DEFAULT_LANGUAGE);
      }
    }
  }, [data]);

  if (error) {
    return (
      <StatusPage
        status="ERROR"
        title={t("to_be_fixed_something_went_wrong", {errorCode: error.code})}
        testId="main-layout-error"
        subTitle={error.message}
        button={{
          size: "lg",
          color: "primary",
          children: t`badge_support_button_label`,
          onClick: () => {
            openLink("mailto:support@example.com");
          },
        }}
        className="h-tg-viewport-height"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-tg-viewport-height items-center justify-center">
        <Spiner />
      </div>
    );
  }

  if (!isLogged) {
    return <Navigate to={{pathname: "/login"}} replace />;
  }
  return (
    <>
      {/* @ts-expect-error: Telegram.WebApp.isFullscreen might not exist */}
      {Telegram.WebApp.isFullscreen && !isDark && (
        <div
          style={{
            background:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 40px, #f7f7f7 40px, #f7f7f7 100%)",
            height: "100px", // Или другая высота, в зависимости от вашего дизайна
            width: "100%",
            position: "fixed", // Чтобы градиент всегда был вверху
            top: 0,
            left: 0,
            zIndex: 0, // Убедитесь, что он перекрывает другие элементы
          }}
        />
      )}
      <div
        style={{
          paddingTop: safePaddingTop,
        }}
        className={twMerge(
          "flex h-tg-viewport-height flex-col",
          routes(t).some(route => route.path === pathname)
            ? "dark:bg-dark-underlay"
            : "dark:bg-dark-bg",
        )}>
        <div className="sticky top-0 z-10">
          <Header />
        </div>
        <div className="flex-grow overflow-y-auto">
          <Outlet />
        </div>
        {pathname !== `/${authRoutes.profile}` && (
          <div className="sticky bottom-0 border-t border-grey-200 bg-white dark:border-dark-surface dark:bg-dark-bg">
            <Footer />
          </div>
        )}
      </div>
    </>
  );
};

export default MainLayout;
