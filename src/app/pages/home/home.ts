import {Component, effect, OnInit, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {Header} from '../../components/header/header';
import {TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion';
import {NgTemplateOutlet} from '@angular/common';
import {Tag} from 'primeng/tag';
import {ApiService} from '../../core/services/api-service';
import {calculateTypingStats, LessonItem, ProgressItem} from '../../utils/helpers';
import {Progress} from '../../components/progress/progress';
import {RouterLink} from '@angular/router';
import {ProgressBar} from 'primeng/progressbar';
import {Dialog} from 'primeng/dialog';

@Component({
  selector: 'app-home',
  imports: [
    Button,
    Header,
    TableModule,
    FormsModule,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    Accordion,
    NgTemplateOutlet,
    Tag,
    Progress,
    RouterLink,
    ProgressBar,
    Dialog
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  selectedLanguage = 'MONGOLIAN';
  showRestartDialog = true;
  all = signal<LessonItem[]>([]);
  lessons = signal<LessonItem[]>([]);
  selectedParent = signal<LessonItem|null>(null);
  subLessons = signal<LessonItem[]>([]);
  selectedLesson = signal<LessonItem|null>(null);
  speedType: string = 'WPM';  //WPM or KPM

  constructor(private readonly apiService: ApiService) {
    this.loadLessons();
    effect(() => {
      const selected = this.selectedParent();

      if (!selected) {
        this.subLessons.set([]);
        return;
      }

      this.loadSubLessons(selected);
    });
  }

  ngOnInit(): void {
  }

  changeLanguage(language: string) {
    this.selectedLanguage = language;
    if (this.all().length > 0) {
      const list = this.all().filter(a => a.categoryParentName === this.selectedLanguage);
      this.lessons.set(list);
      this.selectedParent.set(list[0])
    }
  }

  loadLessons() {
    this.apiService.getAllLessons().subscribe({
      next: data => {
        this.all.set(data);
        const list = data.filter(a => a.categoryParentName === this.selectedLanguage);
        this.lessons.set(list);
        this.selectedParent.set(list[0])
      }
    });
  }

  loadSubLessons(lesson: LessonItem) {
    this.apiService.getSubLessons(lesson.id)
      .subscribe(data => {
        this.subLessons.set(data);
      });
  }

  protected readonly sessionStorage = sessionStorage;

  getAccuracy(p: ProgressItem):number{
    return p.typedChars > 0
      ? (p.correctChars * 100.0 / p.typedChars) : 0;
  }

  getSpeed(progress: ProgressItem) {
    // why is it called two times? who knows?
    // p-accordion darhaar eniig daxin 2 duudaad bgaa asyydal yu baij bolox we?
    // console.log(progress);
    return calculateTypingStats({
      typedChars: progress.typedChars,
      correctChars: progress.correctChars,
      timeSeconds: progress.timeSeconds,
      speedType: this.speedType
    }).net;
  }


  openRestartDialog(lesson: LessonItem) {
    this.selectedLesson.set(lesson);
    this.showRestartDialog = true;
  }

  closeRestartDialog() {
    this.showRestartDialog = false;
  }

  confirmRestart() {
    if (this.selectedLesson()) {
      this.apiService.restartLesson(this.selectedLesson()!.id)
        .subscribe({
          next: () => {
            this.showRestartDialog = false;
          },
          error: err => {
            console.error('Restart failed', err);
          }
        });
    }
  }

  getCateProgress(id: number): number {
    let progress = 0, count = 0;
    // for (let i = 0; i < this.lessons().length; i++) {
    //   if(this.lessons()[i].categoryParent == id) {
    //     if(this.lessons()[i].progress !== null) {
    //       progress = progress + (this.lessons()[i].progress?.completionPercent ?? 0);
    //     }
    //     count++;
    //   }
    // }
    return Math.floor(progress/count);
  }

  protected selectLesson(category: LessonItem) {
    this.selectedLesson.set(category);
  }
}
