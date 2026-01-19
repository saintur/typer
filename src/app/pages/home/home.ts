import {Component, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {Header} from '../../components/header/header';
import {TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion';
import {Badge} from 'primeng/badge';
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
    Badge,
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
export class Home {
  products = [
    {name: 'Name 1', accuracy: 90, progress: 55, wpm: 45, category: 'Code'},
    {
      name: 'Name 2',
      accuracy: 32,
      progress: 5,
      wpm: 47,
      category: 'Code'
    },
    {
      name: 'Name 2',
      accuracy: 0,
      progress: 0,
      wpm: 0,
      category: 'Code'
    }];
  selectedLanguage = 'mn';

  currLng = "MONGOLIAN";
  lessons = signal<LessonItem[]>([]);
  speedType: string = 'WPM';  //WPM or KPM

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getAllLessons().subscribe({
      next: data => {
        this.lessons.set(data);
      }
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

  showRestartDialog = false;
  selectedLessonId!: number;

  openRestartDialog(lessonId: number) {
    this.selectedLessonId = lessonId;
    this.showRestartDialog = true;
  }

  closeRestartDialog() {
    this.showRestartDialog = false;
  }

  confirmRestart() {
    this.apiService.restartLesson(this.selectedLessonId)
      .subscribe({
        next: () => {
          this.showRestartDialog = false;
        },
        error: err => {
          console.error('Restart failed', err);
        }
      });
  }

  getCateProgress(id: number): number {
    let progress = 0, count = 0;
    for (let i = 0; i < this.lessons().length; i++) {
      if(this.lessons()[i].categoryParent == id) {
        if(this.lessons()[i].progress !== null) {
          progress = progress + (this.lessons()[i].progress?.completionPercent ?? 0);
        }
        count++;
      }
    }
    return Math.floor(progress/count);
  }
}
