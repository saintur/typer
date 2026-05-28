import {Component, Signal, signal} from '@angular/core';
import {RouterLink} from '@angular/router';

import { ApiService } from '../../core/services/api-service';
import {calculateTypingStats, LessonItem, ProgressItem} from '../../utils/helpers';
import { AuthService } from '../../core/services/auth-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Progress } from '../../components/progress/progress';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-exercises',
  imports: [
    RouterLink,
    Button,
    Dialog,
    Progress,
    Tag,
  ],
  templateUrl: './exercises.html',
  styleUrl: './exercises.scss',
})
export class Exercises {
  lessons = signal<LessonItem[]>([]);
  subLessons = signal<LessonItem[]>([]);
  selectedLesson = signal<LessonItem | null>(null);
  loadingLessons = signal(true);
  loadingSubLessons = signal(false);
  error = signal<string | null>(null);
  isPrime!: Signal<boolean>;
  showRestartDialog = false;

  constructor(private readonly apiService: ApiService, private readonly auth: AuthService) {
    this.isPrime = toSignal(this.auth.isPremium$(), { initialValue: false });
    this.loadLessons();
    if (auth.isLoggedIn()) {
      this.loadProgress()
    }
  }

  loadProgress() {
    // this.apiService.getAllProgressByUser().subscribe(progress => {
    //   console.log(progress);
    // })
  }

  selectLesson(lesson: LessonItem) {
    this.selectedLesson.set(lesson);
    this.subLessons.set([]);
    this.loadingSubLessons.set(true);
    this.error.set(null);

    this.apiService.getSubLessons(lesson.id).subscribe({
      next: lessons => {
        this.subLessons.set(lessons);
        this.loadingSubLessons.set(false);

        if(this.auth.isLoggedIn()) {

          this.apiService.getLessonProgress(lesson.id).subscribe(progress => {
            this.subLessons.update(lessons =>
              lessons.map(l => ({ ...l, progress: progress[l.id] ?? null }))
            );
          });

        }

      },
      error: () => {
        this.error.set('Хичээлүүдийг ачааллахад алдаа гарлаа.');
        this.loadingSubLessons.set(false);
      }
    });
  }

  private loadLessons() {
    this.loadingLessons.set(true);
    this.error.set(null);

    this.apiService.getAllLessons().subscribe({
      next: lessons => {
        this.lessons.set(lessons);
        this.loadingLessons.set(false);

        const firstLesson = lessons[0];
        if (firstLesson) {
          this.selectLesson(firstLesson);
        }
      },
      error: () => {
        this.error.set('Дасгалын жагсаалтыг ачааллахад алдаа гарлаа.');
        this.loadingLessons.set(false);
      }
    });
  }

  accuracy(p: ProgressItem):number{
    return Math.round(p.typedChars > 0
      ? (p.correctChars * 100.0 / p.typedChars) : 0);
  }

  speed(progress: ProgressItem) {
    // why is it called two times? who knows?
    // p-accordion darhaar eniig daxin 2 duudaad bgaa asyydal yu baij bolox we?
    return calculateTypingStats({
      typedChars: progress.typedChars,
      correctChars: progress.correctChars,
      timeSeconds: progress.timeSeconds,
      speedType: 'WPM'
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
}
