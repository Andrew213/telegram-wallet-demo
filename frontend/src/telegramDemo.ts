type Callback<T = string> = (error: string | null, value: T) => void;

const noop = () => undefined;

const demoBackButton = {
  hide: noop,
  offClick: noop,
  onClick: noop,
  show: noop,
};

const demoBiometricManager = {
  authenticate: (_params: unknown, callback?: (success: boolean) => void) => {
    callback?.(false);
  },
  deviceId: "telegram-wallet-demo-device",
  init: noop,
  isAccessGranted: false,
  isAccessRequested: false,
  isBiometricAvailable: false,
  isBiometricTokenSaved: false,
  isInited: true,
  openSettings: noop,
  requestAccess: (_params: unknown, callback?: (success: boolean) => void) => {
    callback?.(false);
  },
  updateBiometricToken: (
    _token: string,
    callback?: (success: boolean) => void,
  ) => {
    callback?.(false);
  },
};

const demoCloudStorage = {
  getItem: (key: string, callback: Callback) => {
    callback(null, localStorage.getItem(key) ?? "");
  },
  removeItem: (key: string, callback?: Callback<boolean>) => {
    localStorage.removeItem(key);
    callback?.(null, true);
  },
  setItem: (key: string, value: string, callback?: Callback<boolean>) => {
    localStorage.setItem(key, value);
    callback?.(null, true);
  },
};

const demoWebApp = {
  BackButton: demoBackButton,
  BiometricManager: demoBiometricManager,
  CloudStorage: demoCloudStorage,
  close: noop,
  expand: noop,
  isExpanded: true,
  isFullscreen: false,
  offEvent: noop,
  onEvent: noop,
  platform: "web",
  ready: noop,
  sendData: noop,
  setHeaderColor: noop,
  setBackgroundColor: noop,
  version: "7.8",
};

const telegramWindow = window as unknown as {
  Telegram?: {
    WebApp?: Partial<typeof demoWebApp> & Record<string, unknown>;
  };
};

function objectFallback(value: unknown) {
  return value && typeof value === "object" ? value : {};
}

if (!telegramWindow.Telegram) {
  telegramWindow.Telegram = {
    WebApp: demoWebApp,
  };
} else if (!telegramWindow.Telegram.WebApp) {
  telegramWindow.Telegram.WebApp = demoWebApp;
} else {
  telegramWindow.Telegram.WebApp = {
    ...demoWebApp,
    ...telegramWindow.Telegram.WebApp,
    BackButton: {
      ...demoBackButton,
      ...objectFallback(telegramWindow.Telegram.WebApp.BackButton),
    },
    BiometricManager: {
      ...demoBiometricManager,
      ...objectFallback(telegramWindow.Telegram.WebApp.BiometricManager),
    },
    CloudStorage: {
      ...demoCloudStorage,
      ...objectFallback(telegramWindow.Telegram.WebApp.CloudStorage),
    },
  };
}
