import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-keyboard',
  imports: [],
  templateUrl: './keyboard.html',
  styleUrl: './keyboard.scss',
})
export class Keyboard {
  @Input() letter: string = ''
  languages = {
    mn: [
      '1234567890ещ',
      'фцужэнгшүзкъ]',
      'йыбөахролдп',
      'ячёсмитьвю',
    ],
    en: [
      '1234567890-=',
      'qwertyuiop[]\\',
      'asdfghjkl;\'',
      'zxcvbnm,./',
    ]
  };
  special = {
    mn: '№-"₮:._,%?ЕЩ',
    en: '!@#$%^&*()_+'
  };
  @Input() current = 'mn'

  get language() {
    // @ts-ignore
    return this.languages[this.current];
  }

  secondary(index: number) {
    // @ts-ignore
    return this.special[this.current].at(index);
  }

  isUpperCase(letter: string) {
    return ('QWERTYUIOPASDFGHJKLZXCVBNMФЦУЖЭНГШҮЗКЪЙЫБӨАХРОЛДПЯЧЁСМИТЬВЮЕЩ').includes(letter);
  }

  isSpace(letter: string) {
    return (' ').includes(letter);
  }
}
