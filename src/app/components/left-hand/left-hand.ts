import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-left-hand',
  imports: [],
  templateUrl: './left-hand.html',
  styleUrl: './left-hand.scss',
})
export class LeftHand  {
  @Input() letter: string = 'Д';
  @Input() language: string = 'mn';
  fingers = {
    thumb: ' ',
    index: {
      mn: 'ж,ө,с,э,а,с,м,:,.,5,6',
      en: 'r,f,v,t,g,v,b,^,%,5,6'
    },
    middle: {
      mn: 'у,б,ё,₮,",4',
      en: 'e,d,c,$,#,4'
    },
    ring: {
      mn: 'ц,ы,ч,-,2,3',
      en: 'w,s,x,@,2,3',
    },
    pinkie: {
      mn: 'ф,й,я,],[,1',
      en: 'q,a,z,!,~,1',
    }
  }

  get isUpperCase() {
    return (this.letter.match(/[A-ZА-ЯӨҮ]/g) || []).length > 0 || this.letter === ' ';
  }

  get index() {
    // @ts-ignore
    return this.fingers.index[this.language];
  }

  get middle() {
    // @ts-ignore
    return this.fingers.middle[this.language];
  }

  get ring() {
    // @ts-ignore
    return this.fingers.ring[this.language];
  }

  get pinkie() {
    // @ts-ignore
    return this.fingers.pinkie[this.language];
  }
}
