export const SS_TIMER_KEY = "resend_email_time";
export const SS_LOGGED_BY_PIN_KEY = "loggedByPin";

export const LS_TOKEN_KEY = "token";
export const LS_REFRESH_TOKEN_KEY = "refresh_token";
export const LS_PINCODE_KEY = "pincode";
export const LS_MAIN_NOTIFICATION = "main_notification";
export const LS_BIOMETRIC_SAVED = "biometricSaved";
export const LS_THEME = "theme";

export const DEMO_APP_NAME =
  import.meta.env.VITE_APP_NAME || "Telegram Wallet Demo";
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== "false";

export const DEFAULT_LANGUAGE = import.meta.env.VITE_DEFAULT_LANGUAGE || "en";

const availableLanguagesString =
  import.meta.env.VITE_AVAILABLE_LANGUAGES || "en,az,kk,ky,ru,uz";
export const AVAILABLE_LANGUAGES: string[] =
  availableLanguagesString.split(",");
