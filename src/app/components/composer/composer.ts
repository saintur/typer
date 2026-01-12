import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {NoSpacePipe} from '../../pipes/no-space-pipe';
import {AsyncPipe, DecimalPipe} from '@angular/common';
import {BehaviorSubject, interval, Subscription} from 'rxjs';
import {Keyboard} from '../keyboard/keyboard';
import {LeftHand} from '../left-hand/left-hand';
import {RightHand} from '../right-hand/right-hand';

@Component({
  selector: 'app-composer',
  imports: [
    NoSpacePipe,
    DecimalPipe,
    AsyncPipe,
    Keyboard,
    LeftHand,
    RightHand
  ],
  templateUrl: './composer.html',
  styleUrl: './composer.scss',
})
export class Composer implements OnChanges, AfterViewInit, OnInit, OnDestroy {
  private readonly END_VALUE = 60;
  private oneMinute = false

  language = 'mn';

  previous: string = ''
  current: string = '';
  @Input() original: string = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';
  record: string = '';
  backspaced: number = 0;

  protected timerSub?: Subscription;
  time$ = new BehaviorSubject<number>(0);
  currentTime = 0;

  @ViewChild('edit') edit!: ElementRef;

  constructor() {
    this.time$.subscribe(v => {
      this.currentTime = v;
    });
  }

  ngOnInit() {
    this.start();
    this.detectLanguage();
    this.setCurrent(this.original.at(0)||'');
  }

  ngAfterViewInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy() {
    this.pause();
  }

  detectLanguage() {
    if ((this.original.match(/[a-zA-Z]/g) || []).length > 3) {
      this.language = 'en';
    }
    if ((this.original.match(/[а-яА-ЯөүӨҮ]/g) || []).length > 3) {
      this.language = 'mn';
    }
  }

  start() {
    if (this.timerSub) return; // already running

    this.timerSub = interval(1000).subscribe(() => {
      const current = this.time$.value;

      if (this.oneMinute) {
        if (current < this.END_VALUE) {
          this.time$.next(current + 1);
        } else {
          this.pause(); // stop at 0
        }
      } else {
        this.time$.next(current + 1);
      }
    });
  }

  pause() {
    this.timerSub?.unsubscribe();
    this.timerSub = undefined;
  }

  reset() {
    this.time$.next(0);
    this.currentTime = 0;
    this.previous = ''
    this.record = ''
    this.setCurrent(this.original[0])
    this.start();
  }

  setCurrent(current: string) {
    this.current = current;
    if (this.edit) this.edit.nativeElement.innerText = current;
  }

  onChange(event: Event) {
    const element = event.target as HTMLSpanElement;
    if (event instanceof InputEvent) {
      this.previous += event.data || '';
      // this.current = this.original.at(this.previous.length) || '';
      this.setCurrent(this.original.at(this.previous.length) || '')
      element.innerText = this.current;
      this.putCursorToEnd(element);
    }
    this.check();
  }

  onFocus(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    const target = event.target as HTMLSpanElement;
    if (target) this.putCursorToEnd(target!)
  }

  onFocusFromNeighbor(event: PointerEvent | TouchEvent | Event) {
    event.stopPropagation();
    event.preventDefault();
    const element = event.target as HTMLSpanElement;
    const children = element.parentElement?.children;
    const target = children?.item(1) as HTMLSpanElement;
    if (target) this.putCursorToEnd(target!)
  }

  putCursorToEnd(span: HTMLSpanElement) {
    if (span) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(span);
      range.collapse(true); // Collapse the range to its end point (cursor position)
      selection?.removeAllRanges();
      selection?.addRange(range)
      span.focus();
      span.scrollTop = span.scrollHeight;
    }
  }

  check() {
    this.record = this.previous.split('').map((c, index) => {
      const l = this.original[index];
      return c === l ? 'c' : 'i';
    }).join('')
  }

  onKey(event: KeyboardEvent) {
    console.log(this.original);
    if (this.isFreeFormEnd || this.isOneMinuteEnd) {
      event.stopPropagation();
      event.preventDefault();
      this.pause();
      return;
    }
    if (event.key === 'Backspace') {
      if (this.previous.length > 0) {
        this.previous = this.previous.slice(0, -1);
        if (this.previous.length == 0) {
          this.setCurrent(this.original.at(0)!);
        } else {
          this.setCurrent(this.original.at(this.previous.length)!)
        }
        this.edit.nativeElement.innerText = this.current;
        this.backspaced++;
      } else {
        this.setCurrent(this.original.at(0)!);
        this.edit.nativeElement.innerText = this.current;
      }
    }
  }

  get average_chars() {
    const words = this.original.split(' ').map(c => c.length);
    return Math.round(words.reduce((a, b) => a + b, 0) / words.length);
  }

  get incorrect() {
    return (this.record.match(/i/g) || []).length;
  }

  get correct() {
    return (this.record.match(/c/g) || []).length;
  }

  get total() {
    return this.record.length + this.backspaced * 2;
  }

  // Accuracy = (Correct / Total) * 100.
  get accuracy() {
    return (this.correct / this.total)
  }

  // WPM * accuracy / 100 = 54 WPM)
  // total / average chars / time
  get wpm() {
    return ((this.previous.length  / this.average_chars) / (this.currentTime/60)) * this.accuracy;
  }

  get word() {
    return this.previous.split(' ').length - 1;
  }

  get isFreeFormEnd() {
    return !this.oneMinute && this.previous.length === this.original.length;
  }

  get isOneMinuteEnd() {
    return this.oneMinute && this.currentTime === this.END_VALUE;
  }

  toggleTimer() {
    if (this.isFreeFormEnd || this.isOneMinuteEnd) { return }
    this.timerSub ? this.pause() : this.start();
  }

}
