type Data<T> = {
  state: T;
};

export function useStorage<T>(key: string, version?: string) {
  const defaultVersion = "v1";
  const storeKey = `${key}-${version || defaultVersion}`;

  const getItem = async (): Promise<T | null> => {
    try {
      const item = localStorage.getItem(storeKey);
      if (!item) return null;
      const data = JSON.parse(item) as Data<T | null>;
      return data.state || null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const setItem = async (data: T) => {
    localStorage.setItem(storeKey, JSON.stringify({ state: data } as Data<T>));
  };

  const removeItem = async () => {
    localStorage.removeItem(storeKey);
  };

  return {
    getItem,
    setItem,
    removeItem,
  };
}
