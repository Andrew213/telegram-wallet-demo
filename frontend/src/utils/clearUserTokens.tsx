import {queryClient} from "@/api/queryClient";
import {
  LS_BIOMETRIC_SAVED,
  LS_MAIN_NOTIFICATION,
  LS_PINCODE_KEY,
  LS_REFRESH_TOKEN_KEY,
  LS_TOKEN_KEY,
  SS_LOGGED_BY_PIN_KEY,
  SS_TIMER_KEY,
} from "@/constants";
import {removeCloudStorage} from "@/utils/cloudStorage";

export const clearUserTokens = async () => {
  sessionStorage.removeItem(SS_LOGGED_BY_PIN_KEY);
  sessionStorage.removeItem(SS_TIMER_KEY);

  localStorage.removeItem(LS_BIOMETRIC_SAVED);
  localStorage.removeItem(LS_MAIN_NOTIFICATION);
  localStorage.removeItem(LS_BIOMETRIC_SAVED);

  try {
    await Promise.all([
      removeCloudStorage(LS_TOKEN_KEY),
      removeCloudStorage(LS_REFRESH_TOKEN_KEY),
      removeCloudStorage(LS_PINCODE_KEY),
    ]);
  } catch (error) {
    console.error("Ошибка при удалении токенов из облачного хранилища:", error);
  }

  queryClient.clear();
};
