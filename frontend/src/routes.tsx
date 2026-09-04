import {TFunction} from "i18next";

import {
  RegularClock,
  RegularHome,
  RegularReceipt,
  RegularSend,
  RegularWallet,
} from "./assets/icons";
import Bills from "./pages/Bills/Bills";
import Deposit from "./pages/Deposit/Deposit";
import History from "./pages/History/History";
import Home from "./pages/Home/Home";
import Payment from "./pages/Payment/Payment";

export type TRoutePath = "/" | "/deposit" | "/payment" | "/bills" | "/history";

export const menuRoutes: Record<string, TRoutePath> = {
  main: "/",
  deposit: "/deposit",
  payment: "/payment",
  bills: "/bills",
  history: "/history",
};
interface Route<T extends string> {
  path: T;
  Component: React.ComponentType;
  title?: string;
  Icon: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {title?: string}
  >;
}

export const routes = (t: TFunction): Route<TRoutePath>[] =>
  [
    {
      path: menuRoutes.main,
      Component: Home,
      Icon: RegularHome,
      title: t("tab_bar_main_screen_title"),
    },
    {
      path: menuRoutes.deposit,
      Component: Deposit,
      Icon: RegularWallet,
      title: t("tab_bar_deposit_screen_title"),
    },
    {
      path: menuRoutes.payment,
      Component: Payment,
      Icon: RegularSend,
      title: t("tab_bar_transfer_screen_title"),
    },
    {
      path: menuRoutes.bills,
      Component: Bills,
      Icon: RegularReceipt,
      title: t("tab_bar_receipts_screen_title"),
    },
    {
      path: menuRoutes.history,
      Component: History,
      Icon: RegularClock,
      title: t("tab_bar_history_screen_title"),
    },
  ] as const;

export const authRoutes = {
  login: "login",
  signup: "signup",
  signin: "signin",
  code: "signup/code",
  recovery: "signin/recovery",
  resetPassword: "signin/recovery/reset-password",
  profile: "profile",
} as const;
