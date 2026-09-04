export const languageNames = {
  en: "English",
  az: "Azərbaycan",
  kk: "Қазақ",
  ky: "Кыргызча",
  ru: "Русский",
  uz: "O'zbek",
};

export const languageArray: [string, string][] = Object.entries(languageNames);

export type languagesType = keyof typeof languageNames;
