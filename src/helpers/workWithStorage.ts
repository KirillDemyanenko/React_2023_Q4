/**
 * @returns {string} Return saved value of last search or empty string if value is undefined
 */
export const readSearchFromStorage = (): string => {
  return localStorage.getItem(import.meta.env.VITE_APP_STORAGE_KEY) ?? '';
};

/**
 * @param {string} [searchValue] Value for saving to storage
 * @returns {void}
 */
export const writeSearchFromStorage = (searchValue: string): void => {
  localStorage.setItem(import.meta.env.VITE_APP_STORAGE_KEY, searchValue);
};
