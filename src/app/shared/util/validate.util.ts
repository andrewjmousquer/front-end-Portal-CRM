import { Injectable } from '@angular/core';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import { Utils } from './util';

@Injectable({ providedIn: 'root' })
export class ValidateUtil {

  static isEmail(email: string) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
  }

  static isPlate(plate: string) {
    return /^[a-zA-Z]{3}[0-9][A-Za-z0-9][0-9]{2}$/.test(plate)
  }

  static isCPF(value: string) {
    const clean = Utils.removeMask(value);
    return cpf.isValid(clean);
  }

  static isCNPJ(value: string) {
    const clean = Utils.removeMask(value);
    return cnpj.isValid(clean);
  }
}
