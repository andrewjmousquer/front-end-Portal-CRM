import { Injectable } from '@angular/core';
import { Portion } from '../model/portion.model';

@Injectable({ providedIn: 'root' })
export class PortionUtil {

  static buildList(data: Portion[]) {
    data && data.map(portion => {
      portion.name += 'X ' + (portion.tax ? 'C/ JUROS' : 'S/ JUROS');
      return portion;
    });
    return data;
  }
}
