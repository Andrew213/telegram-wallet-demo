import {useState} from "react";
import {useTranslation} from "react-i18next";

import {
  RegularMoon,
  RegularSettings,
  RegularSuccess,
  RegularSun,
} from "@/assets/icons";
import BottomPlate from "@/components/BottomPlate/BottomPlate";
import Button from "@/components/Button/Button";
import {type Theme, useTheme} from "@/core/context/useTheme";

import ProfileOption from "../ProfileOption";
import ThemeOption from "./ThemeOption";

const Theme: React.FC = () => {
  const [isPlateOpened, setIsPlateOpened] = useState<boolean>(false);

  const [theme, setTheme] = useTheme();

  const {t} = useTranslation();

  const [selectedTheme, setSelectedTheme] = useState<Theme>(theme.theme);

  return (
    <>
      <ProfileOption
        title={t`theme_label`}
        text={t(`${theme.theme}_theme_title`)}
        testId="profile-theme"
        onClick={() => {
          setSelectedTheme(theme.theme);
          setIsPlateOpened(true);
        }}
        icon={<RegularMoon />}
      />

      {isPlateOpened && (
        <BottomPlate
          title={t`theme_label`}
          close={() => {
            setIsPlateOpened(false);
          }}>
          {close => (
            <div className="flex flex-col p-4 pt-0">
              <ThemeOption
                title={t`light_theme_title`}
                testId="theme-option-light"
                onClick={() => setSelectedTheme("light")}
                leadIcon={<RegularSun />}
                sideIcon={
                  selectedTheme === "light" ? <RegularSuccess /> : undefined
                }
              />
              <ThemeOption
                title={t`dark_theme_title`}
                testId="theme-option-dark"
                onClick={() => setSelectedTheme("dark")}
                leadIcon={<RegularMoon />}
                sideIcon={
                  selectedTheme === "dark" ? <RegularSuccess /> : undefined
                }
              />
              <ThemeOption
                title={t`system_theme_title`}
                testId="theme-option-system"
                onClick={() => setSelectedTheme("system")}
                leadIcon={<RegularSettings />}
                sideIcon={
                  selectedTheme === "system" ? <RegularSuccess /> : undefined
                }
              />
              <Button
                testId="theme-confirm-button"
                onClick={() => {
                  setTheme(selectedTheme);
                  close();
                }}
                className="mt-4"
                size="lg"
                color="primary">
                {t`confirm_label`}
              </Button>
            </div>
          )}
        </BottomPlate>
      )}
    </>
  );
};

export default Theme;
