import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[wbpCnpjMask]',
  exportAs: 'wbpCnpjMask'
})
export class CnpjMaskDirective {
  cnpj: any;

  constructor(public ngControl: NgControl) { }

  @HostListener('ngModelChange', ['$event']) onModelChange(event) {
    this.onInputChange(event, false);
  }

  @HostListener('keydown.backspace', ['$event']) keydownBackspace(event) {
    this.onInputChange(event.target.value, true);
  }

  onInputChange(event, backspace) {
    let newVal = event.replace(/\D/g, '');
    if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }
    if (newVal.length === 0) {
      newVal = '';
    } else {
      newVal = newVal.replace(/^(\d{2})(\d)/, "$1.$2")
      newVal = newVal.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      newVal = newVal.replace(/\.(\d{3})(\d)/, ".$1/$2");
      newVal = newVal.replace(/(\d{4})(\d)/, "$1-$2");
    }

    this.ngControl.valueAccessor.writeValue(newVal);
  }
}
