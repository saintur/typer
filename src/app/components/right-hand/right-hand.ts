import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-right-hand',
  imports: [],
  templateUrl: './right-hand.html',
  styleUrl: './right-hand.scss',
})
export class RightHand {
  @Input() letter: string = 'Д';
  fingers = {
    thumb: ' ',
    index: 'y,h,b,n,u,j,m,н,х,и,м,г,р,т,^,&,.,_',
    middle: 'i,k,\,,ш,о,ь,*,(,\,,%',
    ring: 'o,l,.,ү,л,в,),_,?',
    pinkie: 'p,;,/,\',[,],з,д,ю,к,п,ъ,shift,_,+,е,щ',
  }

  get isUpperCase() {
    return (this.letter.match(/[A-ZА-ЯӨҮ]/g) || []).length > 0 || this.letter === ' ';
  }
}
