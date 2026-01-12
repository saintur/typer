import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-right-hand',
  imports: [],
  templateUrl: './right-hand.html',
  styleUrl: './right-hand.scss',
})
export class RightHand {
  @Input() letter: string = 'Д';
  @Input() language: string = 'mn';
  fingers = {
    thumb: ' ',
    index: {
      mn: 'н,х,и,м,г,р,т,.,_,7,6',
      en: 'y,h,b,n,u,j,m,^,&,7,6'
    },
    middle: {
      mn: 'ш,о,ь,\,,%,8,9',
      en: 'i,k,\,,*,(,8,9'
    },
    ring: {
      mn: 'ү,л,в,?,0',
      en: 'o,l,.,),0'
    },
    pinkie: {
      mn: 'з,д,ю,к,п,ъ,е,щ',
      en: 'p,;,/,\',[,],_,+'
    },
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
