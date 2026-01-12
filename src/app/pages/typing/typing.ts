import {Component} from '@angular/core';
import {Composer} from "../../components/composer/composer";
import {Header} from '../../components/header/header';

@Component({
  selector: 'app-typing',
  imports: [
    Composer,
    Header
  ],
  templateUrl: './typing.html',
  styleUrl: './typing.scss',
})
export class Typing {

}
