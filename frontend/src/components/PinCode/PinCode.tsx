import {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {twJoin} from "tailwind-merge";

import {RegularCross} from "@/assets/icons";
import {LS_BIOMETRIC_SAVED, LS_PINCODE_KEY} from "@/constants";
import {useAuth} from "@/core/context/useAuth";
import {useCloudStorage} from "@/core/context/useCloudStorage";
import {useTheme} from "@/core/context/useTheme";
import {useLogout} from "@/hooks";
import {clearUserTokens} from "@/utils/clearUserTokens";
import {setCloudStorage} from "@/utils/cloudStorage";

import Button from "../Button/Button";
import PinKeyboard from "../PinKeyboard/PinKeyboard";

interface Props {
  pincodeFromOutside?: string;
  onSuccess?: () => void;
  isClearOnReset?: boolean;
  onClose?: () => void;
  onError?: () => void;
}

const PinCode: React.FC<Props> = ({
  pincodeFromOutside,
  onSuccess,
  isClearOnReset,
  onClose,
  onError,
}) => {
  const [code, setCode] = useState("");

  const [savedCode, setSavedCode] = useState("");

  const [step, setStep] = useState(1);

  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const [isResetPlateVisible, setIsResetPlateVisible] = useState(false);

  const [errCount, setErrorCount] = useState(3);

  const [, setIsLogged] = useAuth();

  const {t} = useTranslation();

  const [_, setToken] = useCloudStorage();

  const {mutate: logout, isSuccess: logoutSuccess} = useLogout();

  const [{isDark}] = useTheme();

  useEffect(() => {
    if (logoutSuccess) {
      setIsLogged(false);
      clearUserTokens();
      setToken("");
      setIsResetPlateVisible(false);
      onClose?.();
    }
  }, [logoutSuccess, onClose, setIsLogged]);

  useEffect(() => {
    const handleBackClick = () => {
      if (!pincodeFromOutside) {
        if (step === 2) {
          setStep(1);
          setError(false);
          setErrorCount(3);
          setSavedCode("");
        }

        if (step === 1) {
          navigate(-1);
        }
      }
    };

    Telegram.WebApp.BackButton.onClick(handleBackClick);
    return () => {
      Telegram.WebApp.BackButton.offClick(handleBackClick);
    };
  }, [navigate, pincodeFromOutside, step]);

  const onFinish = async () => {
    if (!pincodeFromOutside) {
      await setCloudStorage(LS_PINCODE_KEY, savedCode);
    }
    onSuccess?.();
    navigate("/", {replace: true});
  };

  useEffect(() => {
    if (pincodeFromOutside) {
      const loadBiometricAndAuthenticate = async () => {
        const savedBiometric = localStorage.getItem(LS_BIOMETRIC_SAVED);
        const biometric = Telegram.WebApp.BiometricManager;

        if (savedBiometric) {
          if (biometric.isBiometricAvailable && biometric.isAccessGranted) {
            biometric.authenticate({reason: t`biometrics_title`}, success => {
              if (success) {
                onFinish();
              }
            });
          } else {
            localStorage.removeItem(LS_BIOMETRIC_SAVED);
          }
        }
        setSavedCode(pincodeFromOutside);
        setStep(2);
      };

      loadBiometricAndAuthenticate();
    }
  }, [onFinish, pincodeFromOutside, t]);

  const onCodeChange = (value: number | string) => {
    if (code.length > 3) return;
    const currentCode = code + value;
    const isCodeFulled = code.length === 3;
    setCode(currentCode);

    if (isCodeFulled) {
      if (step === 1) {
        setTimeout(() => {
          setSavedCode(currentCode);
          setStep(2);
          setCode("");
        }, 300);
      } else {
        if (currentCode === savedCode) {
          onFinish();
        } else {
          setError(currentCode !== savedCode);
          setTimeout(() => {
            setCode("");
          }, 300);
          if (pincodeFromOutside) {
            if (errCount > 1) {
              setErrorCount(prev => prev - 1);
            } else {
              onError?.();
            }
          }
        }
      }
    }
  };

  const onClear = () => {
    setCode(prev => prev.slice(0, -1));
  };

  return createPortal(
    <>
      <div
        className="fixed left-0 right-0 top-0 z-50 flex h-tg-viewport-height flex-col bg-white dark:bg-dark-bg"
        data-testid="pincode-modal">
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
        <div className="pt-[148px] text-center">
          <p
            className="mb-6 text-p1 font-p1 text-grey-600 dark:text-dark-text-primary"
            data-testid="pincode-title">
            {pincodeFromOutside
              ? t`pin_code_enter`
              : step === 1
                ? t`pin_code_create`
                : t`pin_code_repeat`}
          </p>
          <div className="mb-6 flex justify-center gap-4">
            {Array(4)
              .fill("")
              .map((_el, index) => {
                return (
                  <div
                    key={index}
                    data-testid={`pincode-dot-${index}`}
                    className={twJoin(
                      "size-4 rounded-full",
                      index >= code.length
                        ? "bg-grey-300 dark:bg-dark-neutral"
                        : "bg-blue-300",
                    )}
                  />
                );
              })}
          </div>
          {error && pincodeFromOutside && (
            <div
              className="text-p3 font-p3 text-red-300 dark:text-dark-red-text"
              data-testid="pincode-error-wrong">
              <p className="whitespace-pre-line">
                {t("pin_code_wrong", {attempt: errCount})}
              </p>
            </div>
          )}
          {error && !pincodeFromOutside && (
            <div
              className="text-p3 font-p3 text-red-300 dark:text-dark-red-text"
              data-testid="pincode-error-mismatch">
              {t`pin_code_not_match`}
            </div>
          )}
        </div>

        <PinKeyboard
          onChage={onCodeChange}
          onClear={onClear}
          onReset={() => {
            if (isClearOnReset) {
              setIsResetPlateVisible(true);
            } else {
              setCode("");
            }
          }}
        />
        {isClearOnReset && (
          <div
            data-testid="pincode-reset-modal"
            className={twJoin(
              "absolute inset-0 flex h-screen bg-black bg-opacity-50 transition-opacity",
              isResetPlateVisible
                ? "z-0 bg-black bg-opacity-50"
                : "-z-10 bg-transparent bg-opacity-0",
            )}>
            <div
              className={twJoin(
                "ml-auto mr-auto mt-auto w-full max-w-[375px] rounded-t-4 bg-white p-4 transition-transform dark:bg-dark-bg",

                isResetPlateVisible ? "translate-y-0" : "translate-y-full",
              )}>
              <div className="mb-4 flex items-center justify-between">
                <p
                  className="text-h3 font-h3 dark:text-dark-text-primary"
                  data-testid="pincode-reset-title">
                  {t`reset_modal_title`}
                </p>
                <button onClick={() => setIsResetPlateVisible(false)}>
                  <RegularCross className="dark:text-dark-text-secondary" />
                </button>
              </div>
              <p className="mb-4 text-p2 font-p2 text-grey-600 dark:text-dark-text-primary">
                {t`reset_modal_subtitle`}
              </p>
              <Button
                size="lg"
                onClick={() => {
                  logout();
                }}
                className="mb-4"
                color="primary"
                testId="pincode-reset-confirm">
                {t`reset_label`}
              </Button>
              <Button
                size="lg"
                onClick={() => setIsResetPlateVisible(false)}
                color="secondary"
                testId="pincode-reset-cancel">
                {t`cancel_label`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>,
    document.body,
  );
};

export default PinCode;
