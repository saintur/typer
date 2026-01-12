import {Component} from '@angular/core';
import {Button} from 'primeng/button';
import {Header} from '../../components/header/header';

@Component({
  selector: 'app-home',
  imports: [
    Button,
    Header
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
