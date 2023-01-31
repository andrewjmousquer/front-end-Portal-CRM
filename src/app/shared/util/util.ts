import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { FromToMinMax } from '../enum/from-to-enum';

@Injectable({ providedIn: 'root' })
export class Utils {
  static compareFn(compared1: { id: number }, compared2: { id: number }) {
    return compared1 && compared2 ? compared1.id === compared2.id : compared1 === compared2;
  }

  static formatStringDate(source: string, sourceFormat: string, targetFormat: string) {
    if (source && sourceFormat && targetFormat) {
      const date = moment(source, sourceFormat);

      if (date.isValid()) {
        return date.format(targetFormat);
      }
    }

    return '';
  }

  static dateToString(date: Date) {
    if (date) {
      return moment(date).format('DD/MM/YYYY HH:mm:ss');
    }
    return '-';
  }

  static dateToStringFormat(date: Date, format: string) {
    if (date) {
      return moment(date).format(format);
    }
    return '-';
  }

  static stringToDateFormat(source: string, sourceFormat: string){
    let date = (moment(source)).format(sourceFormat);
    if(date){
      return date;
    } 
    return null;
  }

  static normalizeDate(sourceDate: Date){
    if(sourceDate){
      return new Date(sourceDate.toLocaleString().replace(/-/g, '\/').replace(/T.+/, ''));
    } 
  }

  static hexToRGB(hex: string, opacity: string) {
    let r = '0', g = '0', b = '0';

    if (!hex) return '#FFF';

    if (hex.length == 4) {
      r = "0x" + hex[1] + hex[1];
      g = "0x" + hex[2] + hex[2];
      b = "0x" + hex[3] + hex[3];
    } else if (hex.length == 7) {
      r = "0x" + hex[1] + hex[2];
      g = "0x" + hex[3] + hex[4];
      b = "0x" + hex[5] + hex[6];
    }

    return opacity ? "rgba(" + +r + "," + +g + "," + +b + ", " + opacity + ")" : "rgb(" + +r + "," + +g + "," + +b + ")";
  }

  static removeAccents(text: string) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  }

  static removeMask(text: string) {
    return text && text.replace(/\D+/g, '');
  }

  static titlecase(value: string) {
    let first = value.substring(0, 1).toUpperCase();
    return first + value.substring(1).toLowerCase();
  }

  static deepCopy<T>(instance: T): T {
    if (instance == null) {
      return instance;
    }

    // handle Dates
    if (instance instanceof Date) {
      return new Date(instance.getTime()) as any;
    }

    // handle Array types
    if (instance instanceof Array) {
      var cloneArr = [] as any[];
      (instance as any[]).forEach((value) => { cloneArr.push(value) });
      // for nested objects
      return cloneArr.map((value: any) => Utils.deepCopy<any>(value)) as any;
    }
    // handle objects
    if (instance instanceof Object) {
      var copyInstance = {
        ...(instance as { [key: string]: any }
        )
      } as { [key: string]: any };
      for (var attr in instance) {
        if ((instance as Object).hasOwnProperty(attr))
          copyInstance[attr] = Utils.deepCopy<any>(instance[attr]);
      }
      return copyInstance as T;
    }
    // handling primitive data types
    return instance;
  }

  static formatModelYear( start, end ) {
    let fromTo: any = FromToMinMax;

    if( start && end ) {

      if( start == fromTo.MIN_YEAR && end == fromTo.MAX_YEAR ) {
        return "TODOS";
        
      } else if( start != fromTo.MIN_YEAR && end == fromTo.MAX_YEAR ) {
        return "À PARTIR DE " + start;
        
      } else if( start == fromTo.MIN_YEAR && end != fromTo.MAX_YEAR ) {
        return "ATÉ " + end;
        
      } else if( start != fromTo.MIN_YEAR && end != fromTo.MAX_YEAR ) {
        return "DE " + start + " ATÉ " + end;
      
      } else {
        return "N/D";
      }

    } else {
      return "N/D";
    }
  }

}
