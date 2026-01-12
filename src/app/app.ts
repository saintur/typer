import {Component, signal} from '@angular/core';
import {Composer} from './components/composer/composer';

@Component({
  selector: 'app-root',
  imports: [Composer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('typer');

  constructor() {

  }
}
