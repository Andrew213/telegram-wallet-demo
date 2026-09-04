import {Navigate, Outlet, useLocation} from "react-router-dom";

import AuthHeader from "@/components/AuthHeader/AuthHeader";
import {useAuth} from "@/core/context/useAuth";
import {useTheme} from "@/core/context/useTheme";
import useSafePaddingTop from "@/hooks/useSafePaddingTop";
import {authRoutes} from "@/routes";

const AuthLayout = () => {
  const [isLogged] = useAuth();

  const {pathname} = useLocation();

  const [{isDark}] = useTheme();

  const safePaddingTop = useSafePaddingTop();

  if (isLogged) {
    return <Navigate to={{pathname: "/"}} replace />;
  }
  return (
    <>
      {/* @ts-expect-error: Telegram.WebApp.isFullscreen might not exist */}
      {Telegram.WebApp.isFullscreen && !isDark && (
        <div
          style={{
            background:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 40px, #fff 40px, #fff 100%)",
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
        className="flex h-tg-viewport-height flex-col bg-white dark:bg-dark-bg">
        {pathname !== `/${authRoutes.login}` && <AuthHeader />}
        <div className="flex-grow overflow-auto px-4 pb-4 pt-8">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
