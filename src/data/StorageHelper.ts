export const saveToLocalStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = <T>(key: string): T | null => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};
