export const getCloudStorage = (key: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const cloudStorage = window.Telegram?.WebApp?.CloudStorage;

    if (!cloudStorage) {
      resolve(localStorage.getItem(key));
      return;
    }

    cloudStorage.getItem(key, (err, value) => {
      if (err) {
        reject(err);
      } else {
        resolve(value || localStorage.getItem(key));
      }
    });
  });
};

export const setCloudStorage = (key: string, value: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    localStorage.setItem(key, value);
    const cloudStorage = window.Telegram?.WebApp?.CloudStorage;

    if (!cloudStorage) {
      resolve();
      return;
    }

    cloudStorage.setItem(key, value, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const removeCloudStorage = (key: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    localStorage.removeItem(key);
    const cloudStorage = window.Telegram?.WebApp?.CloudStorage;

    if (!cloudStorage) {
      resolve();
      return;
    }

    cloudStorage.removeItem(key, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
