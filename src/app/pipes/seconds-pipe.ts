import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'seconds',
})
export class SecondsPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    const [timer] = args
    return timer ? 60 - parseInt(value) : value;
  }

}
