import {initUtils} from "@telegram-apps/sdk-react";
import {useCallback} from "react";

export function useOpenLink() {
  return useCallback((url: string) => {
    const platform = window.Telegram.WebApp.platform;
    const isTelegramPlatform = [
      "android",
      "android_x",
      "ios",
      "macos",
      "tdesktop",
      "unigram",
    ].includes(platform);
    const isWebUrl = /^https?:\/\//.test(url);

    if (isTelegramPlatform && isWebUrl) {
      initUtils().openLink(url);
      return;
    }

    if (url.startsWith("#")) {
      window.location.hash = url;
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  }, []);
}
