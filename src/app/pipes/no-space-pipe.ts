import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noSpace',
})
export class NoSpacePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    let t = value;
    if (value && value.length > 0) {
      const t = value.replaceAll(/&nbsp;/g, " ");
    }
    return t;
  }

}
