import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-left-hand',
  imports: [],
  templateUrl: './left-hand.html',
  styleUrl: './left-hand.scss',
})
export class LeftHand  {
  @Input() letter: string = 'Д';
  fingers = {
    thumb: ' ',
    index: 'r,f,v,t,g,b,ж,ө,с,э,а,с,м^,%,:,.',
    middle: 'e,d,c,у,б,ё,$,#,₮"',
    ring: 'w,s,x,ц,ы,ч,@,-,№',
    pinkie: 'q,a,z,фй,я,!,~,[,shift',
  }

  get isUpperCase() {
    return (this.letter.match(/[A-ZА-ЯӨҮ]/g) || []).length > 0 || this.letter === ' ';
  }
}
