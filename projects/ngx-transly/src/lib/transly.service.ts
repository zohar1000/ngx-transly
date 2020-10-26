import { ComponentFactoryResolver, ComponentRef, Inject, Injectable, Injector } from '@angular/core';
import { TranslyLocalStorage } from './models/transly-local-storage.model';
import { TranslyConfig } from './models/transly-config.model';
import { transly } from './transly.const';
import { TRANSLY_CONFIG } from './tokens/transly-config.token';
import { BehaviorSubject } from 'rxjs';
import { TranslyOnText } from './models/transly-on-text.model';

@Injectable({ providedIn: 'root' })
export class TranslyService {
  readonly FALLBACK_LANG = 'en';
  private langCode;
  private langName;
  private text;
  private langs = {};
  private injector: Injector = Injector.create({ providers: [] });
  text$: unknown = new BehaviorSubject<unknown>('');
  isText$ = new BehaviorSubject(false);
  onTextFns = [];

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              @Inject(TRANSLY_CONFIG) private config: TranslyConfig) {
    this.init().then();
  }

  async init() {
    const lsStr = localStorage.getItem(this.config.localStorageKey);
    let langCode;
    if (lsStr) {
      const lsItem: TranslyLocalStorage = JSON.parse(lsStr);
      langCode = lsItem.langCode;
    } else {
      let langItem;
      if (this.config.isUseBrowserDefaultLang && navigator) {
        langCode = navigator.language;
        langItem = this.config.langs.find(item => item.code.toLowerCase() === langCode.toLowerCase());
        if (!langItem) {
          langCode = langCode.substr(0, 2);
          langItem = this.config.langs.find(item => item.code.toLowerCase() === langCode.toLowerCase());
        }
        if (!langItem) langCode = '';
      }
      if (!langCode) {
        langItem = this.config.langs.find(item => item.default);
        if (langItem) langCode = langItem.code;
      }
      if (!langCode) langCode = this.FALLBACK_LANG;
    }
    await this.setLang(langCode);
  }

  async setLang(langCode) {
    if (!this.langs[langCode]) {
      try {
        this.langs[langCode] = await this.loadLang(langCode);
      } catch (e) {
        if (this.config.onLoadError) this.config.onLoadError(langCode, this.config, e);
        console.error('Error loading language file, language:', langCode, ', config:', this.config, ', error:', e);
      }
    }
    if (this.langs[langCode]) {
      this.langCode = langCode;
      this.langName = this.config.langs.find(item => item.code === this.langCode).name;
      this.text = this.langs[langCode];
      this.updateLocalStorage(langCode);
      if (this.config.setText) this.config.setText(this.text);
      (this.text$ as BehaviorSubject<unknown>).next(this.text);
      this.isText$.next(true);
      this.onTextFns.forEach(fn => this.callOnTextFn(fn));
      this.onTextFns.length = 0;
    }
  }

  async loadLang(langCode) {
    const file: any = await this.config.loadLang(langCode);
    const className: any = Object.keys(file)[0];
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(file[className]);
    const inst: ComponentRef<any> = componentFactory.create(this.injector);
    return inst.instance.text;
  }

  get translate() {
    return transly;
  }

  updateLocalStorage(langCode) {
    const lsItem: TranslyLocalStorage = { langCode };
    localStorage.setItem(this.config.localStorageKey, JSON.stringify(lsItem));
  }

  onText(fn) {
    if (this.isText$.value) {
      this.callOnTextFn(fn);
    } else {
      this.onTextFns.push(fn);
    }
  }

  callOnTextFn(fn) {
    const data: TranslyOnText = { text: this.text, langCode: this.langCode, langName: this.langName, langs: this.config.langs };
    fn(data);
  }
}
