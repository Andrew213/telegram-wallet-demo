import {GetAccount} from "@/api/requests";
import {DEFAULT_LANGUAGE} from "@/constants";

import {getDemoBalances} from "./balances";

const DEMO_LANGUAGE_KEY = "demo_default_language";

export const DEMO_EMAIL = "demo@example.com";
export const DEMO_PASSWORD = "Demo12345!";
export const DEMO_OTP = "123456";
export const DEMO_ACCESS_TOKEN = "demo-access-token";
export const DEMO_REFRESH_TOKEN = "demo-refresh-token";
export const DEMO_CODE_TOKEN = "demo-code-token";
export const DEMO_NOTIFICATION_TOKEN = "demo-notification-token";

export function getDemoAccount(): GetAccount.Account {
  return {
    id: 1001,
    email: DEMO_EMAIL,
    account_number: 700000001,
    status: GetAccount.AccountStatus.verified,
    ip_list: [],
    default_lang: localStorage.getItem(DEMO_LANGUAGE_KEY) ?? DEFAULT_LANGUAGE,
    timezone: "UTC",
    birthdate: null,
    use_infodesk: false,
    shop_transfer_enabled: true,
    auth_methods: {
      1: false,
    },
    auth_operations: {
      2: GetAccount.TwoFactorType.NONE,
      20: GetAccount.TwoFactorType.NONE,
      22: GetAccount.TwoFactorType.NONE,
      38: GetAccount.TwoFactorType.NONE,
    },
    verification_method: 0,
    balances: getDemoBalances(),
    is_trusted: true,
    tags: [],
  };
}

export function setDemoLanguage(language: string) {
  localStorage.setItem(DEMO_LANGUAGE_KEY, language);
}
