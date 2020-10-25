export interface TranslyConfig {
  langs: Array<{
    code: string;
    path: string;
    name: string;
    default?: boolean;
  }>;
  isUseBrowserDefaultLang: boolean;
  getLang: (langCode: string) => void;
  setText: (text) => void;
  localStorageKey: string;
}
