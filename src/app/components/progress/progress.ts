import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-progress',
  imports: [
    FormsModule
  ],
  templateUrl: './progress.html',
  styleUrl: './progress.scss',
})
export class Progress {
  @Input() value: number = 90;
  @Input() max: number = 100;
  @Input() label: string = 'T';

  @Input() size = 38;
  @Input() width = 6;


  get radius() {
    return this.size/2 - this.width/2
  }

  get maxValue() {
    return 2 * 3.14 * this.radius
  }

  get percent() {
    return (this.maxValue * this.value) / this.max
  }

  get color() {
    const c = this.value / this.max
    if (c >= 0.75) { return 'var(--p-primary-color'}
    else if (c < 0.75 && c >= 0.5) { return 'var(--p-orange-500'}
    else { return 'var(--p-red-500'}
  }

}
