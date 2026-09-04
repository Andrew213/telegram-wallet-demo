import i18n from "i18next";
import HttpApi from "i18next-http-backend";
import {initReactI18next} from "react-i18next";

import {AVAILABLE_LANGUAGES} from "@/constants";

i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    supportedLngs: AVAILABLE_LANGUAGES,
    fallbackLng: "en",
    backend: {
      loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}.json`,
    },
  });

export default i18n;
