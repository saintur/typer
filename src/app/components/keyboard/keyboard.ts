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
      '][ 1№ 2- 3" 4₮ 5: 6. 7_ 8, 9% 0? е щ',
      'ф ц у ж э н г ш ү з к ъ ]}',
      'й ы б ө а х р о л д п',
      'я ч ё с м и т ь в ю',
    ],
    en: [
      '`~ 1! 2@ 3# 4$ 5% 6^ 7& 8* 9( 0) -_ =+',
      'q w e r t y u i o p [{ ]} \\|' ,
      'a s d f g h j k l ;: \'"'  ,
      'z x c v b n m ,< .> /?'
    ]
  };
  shifted = {
    mn: '№-"₮:._,%?}[',
    en: '!@#$%^&*()_+<>?:"{}|_+~'
  };
  @Input() current = 'mn'

  get language() {
    // @ts-ignore
    return this.languages[this.current];
  }

  get isUpperCase() {
    return (this.letter.match(/[A-ZА-ЯӨҮ]/g) || []).length > 0
  }

  get isShifted() {
    // @ts-ignore
    return this.shifted[this.current].includes(this.letter);
  }

  get isSpace() {
    return (' ').includes(this.letter);
  }
}
