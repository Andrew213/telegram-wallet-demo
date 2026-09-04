import {useState} from "react";
import {useTranslation} from "react-i18next";
import {twMerge} from "tailwind-merge";

import {RegularSuccess, RegularWorld} from "@/assets/icons";
import BottomPlate from "@/components/BottomPlate/BottomPlate";
import {DEFAULT_LANGUAGE} from "@/constants";
import {useCloudStorage} from "@/core/context/useCloudStorage";
import {useSystemMessage} from "@/core/context/useSystemMessage";
import useGetAccount from "@/pages/hooks/useGetAccount";
import ProfileOption from "@/pages/Profile/components/ProfileOption";
import usePutAccount from "@/pages/Profile/hooks/usePutAccount";
import {userError} from "@/utils";
import {
  languageArray,
  languageNames,
  languagesType,
} from "@/utils/languageNames";

const Language: React.FC = () => {
  const [isPlateOpen, setIsPlateOpen] = useState(false);

  const [token] = useCloudStorage();

  const {data} = useGetAccount(token);

  const [currentLanguage, setCurrentLanguage] = useState(
    () => data?.default_lang || DEFAULT_LANGUAGE,
  );

  const [, setMessage] = useSystemMessage();

  const {mutateAsync: changeLang} = usePutAccount();

  const {t, i18n} = useTranslation();

  const handleOnChangeLanguage = (lang: languagesType) => {
    changeLang(
      {default_lang: lang},
      {
        onError(error) {
          setMessage(userError(error));
        },
        onSuccess() {
          setCurrentLanguage(lang);
          i18n.changeLanguage(lang);
        },
      },
    );
  };
  return (
    <>
      <ProfileOption
        title={t`profile_screen_change_language_label`}
        testId="profile-language"
        onClick={() => setIsPlateOpen(true)}
        text={languageNames[currentLanguage as languagesType]}
        icon={<RegularWorld />}
      />
      {isPlateOpen && (
        <BottomPlate
          title={t`profile_screen_change_language_label`}
          close={() => setIsPlateOpen(false)}>
          {close => (
            <div className="flex flex-col p-4 pt-0">
              {languageArray.map((lang, i) => {
                const langCode = lang[0] as languagesType;
                const langName = lang[1];
                const notLast = i !== languageArray.length - 1;
                return (
                  <button
                    type="button"
                    data-testid={`language-option-${langCode}`}
                    className={twMerge(
                      "flex w-full items-center py-4 text-p3 font-p3 dark:text-dark-text-primary",
                      notLast &&
                        "border-b border-grey-200 dark:border-dark-surface",
                    )}
                    onClick={() => {
                      handleOnChangeLanguage(langCode);
                      close();
                    }}
                    key={lang[0]}>
                    {langName}
                    {currentLanguage === langCode && (
                      <RegularSuccess
                        data-testid="language-option-selected-icon"
                        className="ml-auto text-green-200"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </BottomPlate>
      )}
    </>
  );
};

export default Language;
