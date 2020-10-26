import { ModuleWithProviders, NgModule } from '@angular/core';
import { TranslyConfig } from './models/transly-config.model';
import { TRANSLY_CONFIG } from './tokens/transly-config.token';

@NgModule({})
export class TranslyRootModule {
  static forRoot(config: TranslyConfig): ModuleWithProviders<TranslyRootModule> {
    return {
      ngModule: TranslyRootModule,
      providers: [{ provide: TRANSLY_CONFIG, useValue: config }]
    };
  }
}
