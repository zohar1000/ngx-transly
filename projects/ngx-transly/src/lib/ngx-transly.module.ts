import { ModuleWithProviders, NgModule } from '@angular/core';
import { TranslyPipe } from './pipes/transly.pipe';
import { TranslyConfig } from './models/transly-config.model';
import { TRANSLY_CONFIG } from './tokens/transly-config.token';

@NgModule({
  declarations: [TranslyPipe],
  exports: [TranslyPipe]
})
export class NgxTranslyModule {
  static forFeature(config: TranslyConfig): ModuleWithProviders<NgxTranslyModule> {
    return {
      ngModule: NgxTranslyModule,
      providers: [
        { provide: TRANSLY_CONFIG, useValue: config }
      ]
    };
  }
}
