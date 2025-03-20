import localStorageItems from "./localStorageItems";

export const defaultLang = localStorage.getItem(localStorageItems.langId) ?? 'ru';
