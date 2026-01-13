import {Component} from '@angular/core';
import {Composer} from "../../components/composer/composer";
import {Header} from '../../components/header/header';
import {ActivatedRoute} from '@angular/router';

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
  timer = false;

  constructor(private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(params => {
      if (params['timer'] === 'on') {
        this.timer = true;
      }
    })
  }
}
