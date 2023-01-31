import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'currencyBR'
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number | string, currencyCode: string = 'BRL', symbolDisplay: boolean = true, digits?: string): string {
    if (!value) {
      return 'R$ 0,00';
    }

    let currencyPipe: CurrencyPipe = new CurrencyPipe('pt-BR');
    let newValue: string = currencyPipe.transform(value, currencyCode, symbolDisplay, digits);

    return newValue;
  }
}
