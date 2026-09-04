import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

import {RegularLogout} from "@/assets/icons";
import BottomPlate from "@/components/BottomPlate/BottomPlate";
import Button from "@/components/Button/Button";
import {useAuth} from "@/core/context/useAuth";
import {useCloudStorage} from "@/core/context/useCloudStorage";
import {useSystemMessage} from "@/core/context/useSystemMessage";
import {useLogout} from "@/hooks";
import {authRoutes} from "@/routes";
import {userError} from "@/utils";
import {clearUserTokens} from "@/utils/clearUserTokens";

import ProfileOption from "./ProfileOption";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  const {mutateAsync: logout} = useLogout();

  const [_, setToken] = useCloudStorage();

  const [, setMessage] = useSystemMessage();

  const [, setIsLogged] = useAuth();

  const {t} = useTranslation();

  const [isLoggout, setIsLogout] = useState(false);

  return (
    <>
      <ProfileOption
        title={t`logout_modal_title`}
        testId="profile-logout"
        onClick={() => setIsLogout(true)}
        icon={<RegularLogout />}
      />
      {isLoggout && (
        <BottomPlate
          title={t`logout_modal_title`}
          close={() => setIsLogout(false)}>
          {close => (
            <div className="flex flex-col gap-4 p-4 pt-0">
              <p className="text-p2 font-p2 text-grey-600 dark:text-dark-text-primary">
                {t`logout_modal_subtitle`}
              </p>
              <Button
                onClick={() => {
                  logout()
                    .then(() => {
                      clearUserTokens();
                      setToken("");
                      setIsLogged(false);
                      navigate(`/${authRoutes.login}`);
                    })
                    .catch(err => {
                      setMessage(userError(err));
                    });
                }}
                testId="profile-logout-confirm-button"
                color="primary"
                size="lg">
                {t`reset_logout_label`}
              </Button>
              <Button
                onClick={close}
                size="lg"
                color="secondary"
                testId="profile-logout-cancel-button">
                {t`cancel_logout_label`}
              </Button>
            </div>
          )}
        </BottomPlate>
      )}
    </>
  );
};

export default Logout;
