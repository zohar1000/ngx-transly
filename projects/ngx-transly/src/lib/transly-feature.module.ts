import { NgModule } from '@angular/core';
import { TranslyPipe } from './pipes/transly.pipe';

@NgModule({
  declarations: [TranslyPipe],
  exports: [TranslyPipe]
})
export class TranslyFeatureModule {}
