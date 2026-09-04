import {
  initSwipeBehavior,
  isTMA,
  postEvent,
  supports,
} from "@telegram-apps/sdk-react";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {Route, Routes, useNavigate} from "react-router-dom";

import globalRouter from "./globalRouter";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import Code from "./pages/Login/Code/Code";
import Login from "./pages/Login/Login";
import Recovery from "./pages/Login/Recovery/Recovery";
import ResetPassword from "./pages/Login/ResetPassword/ResetPassword";
import SignIn from "./pages/Login/SignIn/SignIn";
import SignUp from "./pages/Login/SignUp/SignUp";
import Profile from "./pages/Profile/Profile";
import {authRoutes, routes} from "./routes";

const webApp = window.Telegram.WebApp;

if (supports("web_app_biometry_request_access", webApp.version)) {
  webApp.BiometricManager.init();
}

function App() {
  const navigate = useNavigate();

  globalRouter.navigate = navigate;

  useEffect(() => {
    isTMA()
      .then(isTMAres => {
        if (!isTMAres) {
          return;
        }

        const [swipeBehavior] = initSwipeBehavior();
        if (swipeBehavior.supports("disableVerticalSwipe")) {
          swipeBehavior.disableVerticalSwipe();
          // @ts-expect-error: current SDK types do not include this Mini App event yet.
          postEvent("web_app_request_fullscreen");
        }
        postEvent("web_app_setup_back_button", {is_visible: true});
        webApp.onEvent("viewportChanged", _e => {
          window.scrollTo(0, 0);
          setTimeout(() => window.scrollTo({top: 0, behavior: "smooth"}), 200);
        });
      })
      .catch(() => undefined);
  }, []);
  const {t} = useTranslation();

  return (
    <>
      <div className="scroll-smooth bg-grey-100 font-robotoFlex dark:bg-dark-bg">
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path={authRoutes.login} element={<Login />} />
            {import.meta.env?.VITE_DISABE_SIGNUP !== "true" && (
              <Route path={authRoutes.signup} element={<SignUp />} />
            )}
            <Route path={authRoutes.signin} element={<SignIn />} />
            <Route path={authRoutes.code} element={<Code />} />
            {import.meta.env?.VITE_DISABE_RESET_PASSWORD !== "true" && (
              <Route path={authRoutes.recovery} element={<Recovery />} />
            )}
            <Route
              path={authRoutes.resetPassword}
              element={<ResetPassword />}
            />
          </Route>
          <Route path="/" element={<MainLayout />}>
            {routes(t).map(({path, Component}) => {
              return <Route key={path} path={path} element={<Component />} />;
            })}
            <Route path={authRoutes.profile} element={<Profile />} />
          </Route>
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
