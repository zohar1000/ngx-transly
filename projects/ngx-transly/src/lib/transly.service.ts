import { ComponentFactoryResolver, ComponentRef, Inject, Injectable, Injector } from '@angular/core';
import { TranslyLocalStorage } from './models/transly-local-storage.model';
import { TranslyConfig } from './models/transly-config.model';
import { transly } from './transly.const';
import { TRANSLY_CONFIG } from './tokens/transly-config.token';

@Injectable({ providedIn: 'root' })
export class TranslyService {
  readonly FALLBACK_LANG = 'en';
  langCode;
  text;
  langs = {};
  injector: Injector = Injector.create({ providers: [] });
  isReplaceAllEnabled;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              @Inject(TRANSLY_CONFIG) private config: TranslyConfig) {
    this.init().then();
  }

  async init() {
    let lang: TranslyLocalStorage;
    const lsItem = localStorage.getItem(this.config.localStorageKey);
    if (!lsItem) {
      let langCode;
      if (this.config.isUseBrowserDefaultLang && navigator) {
        langCode = navigator.language;
        let langItem = this.config.langs.find(item => item.code.toLowerCase() === langCode.toLowerCase());
        if (!langItem) {
          langCode = langCode.substr(0, 2);
          langItem = this.config.langs.find(item => item.code.toLowerCase() === langCode.toLowerCase());
        }
        if (!langItem) langCode = '';
      }
      if (!langCode) {
        const langItem = this.config.langs.find(item => item.default);
        if (langItem) langCode = langItem.code;
      }
      if (!langCode) langCode = this.FALLBACK_LANG;
      lang = { langCode };
      localStorage.setItem(this.config.localStorageKey, JSON.stringify(lang));
    } else {
      lang = JSON.parse(lsItem);
    }
    await this.setLang(lang.langCode);
  }

  async setLang(langCode) {
    this.langCode = langCode;
    const lang: TranslyLocalStorage = { langCode };
    localStorage.setItem(this.config.localStorageKey, JSON.stringify(lang));
    if (!this.langs[langCode]) {
      this.langs[langCode] = await this.loadLang(langCode);
    }
    this.text = this.langs[langCode];
    this.config.setText(this.text);
  }

  async loadLang(langCode) {
    const file: any = await this.config.getLang(langCode);
    const className: any = Object.keys(file)[0];
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(file[className]);
    const inst: ComponentRef<any> = componentFactory.create(this.injector);
    return inst.instance.text;
  }

  getLangs() {
    return this.config.langs;
  }

  get translate() {
    return transly;
  }
}
