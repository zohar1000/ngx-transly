import { Pipe, PipeTransform } from '@angular/core';
import { TranslyService } from '../transly.service';

@Pipe({ name: 'transly' })
export class TranslyPipe implements PipeTransform {
  constructor(private translyService: TranslyService) {}

  transform(value: unknown, ...args: unknown[]): unknown {
    if (!value) return '';
    if (!args) return value;
    return this.translyService.translate(value, ...args);
  }
}
