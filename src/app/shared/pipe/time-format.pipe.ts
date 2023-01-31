import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    const hours = Math.floor( value / 3600 );
    const minutes = Math.floor( (value / 60) % 60 );
    const seconds = (value % 60 );

    let formatedTime = '';

    if ( hours > 0 ) {
      formatedTime += ( hours + ':' );
      formatedTime += ( ( minutes.toString().length < 2 ? '0' + minutes.toString() : minutes.toString() ) );

    } else if ( minutes > 0 ) {
      formatedTime += ( minutes + ' min' );
    } else {
      formatedTime += ( seconds + ' seg' );
    }

    return formatedTime;
  }

}
