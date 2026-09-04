import {useState} from "react";
import {useTranslation} from "react-i18next";

import {RegularFaceID} from "@/assets/icons";
import Switch from "@/components/Switch/Switch";
import {LS_BIOMETRIC_SAVED} from "@/constants";
import {useSystemMessage} from "@/core/context/useSystemMessage";

const Biometry: React.FC = () => {
  const biometric = Telegram.WebApp.BiometricManager;

  const [, setMessage] = useSystemMessage();

  const {t} = useTranslation();

  const [checked, setChecked] = useState<boolean | string | undefined>(
    () => !!localStorage.getItem(LS_BIOMETRIC_SAVED),
  );

  const onBiometrySwitchChanged = (
    value: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const isChecked = value.target.checked;
    if (isChecked) {
      if (Telegram.WebApp.BiometricManager.isInited) {
        if (!biometric.isBiometricAvailable || !biometric.isAccessGranted) {
          setMessage(t`biometrics_disabled`);
        }
        biometric.requestAccess(
          {reason: t`biometrics_title`},
          accessSuccess => {
            if (accessSuccess) {
              biometric.authenticate(
                {reason: t`biometrics_description`},
                success => {
                  setChecked(success);
                  if (success) {
                    setMessage(t`biometrics_enabled`);
                  }
                },
              );
              localStorage.setItem(LS_BIOMETRIC_SAVED, "true");
            }
          },
        );
      }
    } else {
      localStorage.removeItem(LS_BIOMETRIC_SAVED);
      setChecked(isChecked);
    }
  };

  return (
    <div
      className="flex w-full items-start gap-4 py-4"
      data-testid="profile-biometry-container">
      <div
        className="rounded-4 bg-grey-200 p-2 dark:bg-dark-surface dark:text-dark-text-primary"
        data-testid="profile-biometry-icon">
        <RegularFaceID />
      </div>
      <div className="w-full max-w-[210px]">
        <p
          className="mb-1 text-p3 font-p3 dark:text-dark-text-primary"
          data-testid="profile-biometry-title">
          {t`biometric_authentication_label`}
        </p>
        <p
          className="text-p4 font-p4 text-grey-400 dark:text-dark-text-tertiary"
          data-testid="profile-biometry-description">
          {t`biometric_description_text`}
        </p>
      </div>
      <div className="ml-auto">
        <Switch
          testId="profile-biometry"
          checked={!!checked}
          onChange={onBiometrySwitchChanged}
        />
      </div>
    </div>
  );
};

export default Biometry;
