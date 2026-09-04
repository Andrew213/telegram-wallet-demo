import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import AuthQueryMethods from "@/api/services/AuthService/query";
import PinCode from "@/components/PinCode/PinCode";
import Spiner from "@/components/Spiner/Spiner";
import {LS_PINCODE_KEY, SS_LOGGED_BY_PIN_KEY} from "@/constants";
import {useCloudStorage} from "@/core/context/useCloudStorage";
import {useLogout} from "@/hooks";
import {authRoutes} from "@/routes";
import {clearUserTokens} from "@/utils/clearUserTokens";
import {getCloudStorage} from "@/utils/cloudStorage";

import {AuthContext, AuthSetterContext} from "../context/useAuth";

const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [isLogged, setIsLogged] = useState(false);

  const navigate = useNavigate();

  const [pincodeFromLs, setPincodeFromLs] = useState("");

  const [loadingCodeFromCloudStorage, setLoadingCodeFromCloudStorage] =
    useState(false);

  const [token, setToken] = useCloudStorage();

  const {data, isLoading} = useQuery({
    queryKey: ["checkAuth"],
    queryFn: () =>
      AuthQueryMethods.checkAuthGet().then(res => {
        if (!res.data) {
          clearUserTokens();
          setPincodeFromLs("");
          setIsLogged(false);
        }
        return res;
      }),
    gcTime: 0,
    enabled: !!token,
  });

  const {mutateAsync: logout} = useLogout();

  useEffect(() => {
    const loadPincodeAndCheckLogin = async () => {
      setLoadingCodeFromCloudStorage(true);
      const pincode = await getCloudStorage(LS_PINCODE_KEY);
      const alreadyLoggedByPin = sessionStorage.getItem(SS_LOGGED_BY_PIN_KEY);
      if (pincode && !alreadyLoggedByPin && isLogged) {
        setPincodeFromLs(pincode);
      }
      setLoadingCodeFromCloudStorage(false);
    };
    loadPincodeAndCheckLogin();
  }, [isLogged]);

  const onSuccessLoggedByPin = () => {
    sessionStorage.setItem(SS_LOGGED_BY_PIN_KEY, "true");
    setPincodeFromLs("");
  };

  useEffect(() => {
    setIsLogged(!!data?.data);
  }, [data?.data]);

  if (isLoading || loadingCodeFromCloudStorage) {
    return (
      <div className="flex h-tg-viewport-height items-center justify-center dark:bg-dark-bg">
        <Spiner />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={isLogged}>
      <AuthSetterContext.Provider value={setIsLogged}>
        {children}
        {pincodeFromLs && (
          <>
            <PinCode
              isClearOnReset
              pincodeFromOutside={pincodeFromLs}
              onClose={() => setPincodeFromLs("")}
              onSuccess={onSuccessLoggedByPin}
              onError={async () => {
                await logout().then(() => {
                  clearUserTokens();
                  setIsLogged(false);
                  setToken("");
                  setPincodeFromLs("");
                  navigate(`/${authRoutes.login}`, {replace: true});
                });
              }}
            />
          </>
        )}
      </AuthSetterContext.Provider>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
