import {Component, signal} from '@angular/core';
import {RouterLink} from '@angular/router';

import {ApiService} from '../../core/services/api-service';
import {LessonItem} from '../../utils/helpers';
import {AuthService} from '../../core/services/auth-service';

@Component({
  selector: 'app-exercises',
  imports: [
    RouterLink,
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

  constructor(private readonly apiService: ApiService, private readonly auth: AuthService) {
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
}
