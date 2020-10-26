export interface TranslyConfig {
  langs: Array<{
    code: string;
    path: string;
    name: string;
    default?: boolean;
  }>;
  isUseBrowserDefaultLang: boolean;
  loadLang: (langCode: string) => void;
  setText?: (text) => void;
  localStorageKey: string;
  onLoadError?: (langCode: string, config: TranslyConfig, e: Error) => void;
}
