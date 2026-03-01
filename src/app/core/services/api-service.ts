import {Injectable} from '@angular/core';
import {ExerciseItem, LessonItem, UpgradePlan} from '../../utils/helpers';
import {catchError, map, Observable, of, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorage} from "./local-storage";
import {CacheService} from './cache-service';
import {BlogSafeT, BlogT} from '../../pages/blog/blog';
import {findFirst, findRest} from '../../utils/paragraph';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected baseUrl: string = environment.api_url;

  constructor(private http: HttpClient,
              private cache: CacheService,
              private readonly _localStorage: LocalStorage,) {
  }

  // Category
  getAllLessons(): Observable<LessonItem[]> {
    const headers = new HttpHeaders({
      Authorization: this._localStorage.getAccessToken() ? `Bearer ${this._localStorage.getAccessToken()}` : ``,
    });

    return this.http.get<LessonItem[]>(`${this.baseUrl}/v2/categories/lessons`, {headers});
  }

  getSubLessons(id: number): Observable<LessonItem[]> {
    const key = `lessonsFor${id}`;
    if (this.cache.has(key)) {
      return of(this.cache.get<LessonItem[]>(key)!);
    }
    const headers = new HttpHeaders({
      Authorization: this._localStorage.getAccessToken() ? `Bearer ${this._localStorage.getAccessToken()}` : ``,
    });

    return this.http.get<LessonItem[]>(`${this.baseUrl}/v2/categories/lessons/${id}`, {headers})
      .pipe(
        tap(lessons => this.cache.set<LessonItem[]>(key, lessons)),
        catchError(err => {
          this.cache.delete(key);
          throw err;
        })
      );
  }

  restartLesson(selectedLessonId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });
    return this.http.post(`${this.baseUrl}/v1/category/${selectedLessonId}/restart`, {}, {headers})
  }

  // all exercises
  getAllExercise(lesson: number): Observable<ExerciseItem[]> {
    return this.http.get<ExerciseItem[]>(`${this.baseUrl}/v1/exercises/all/${lesson}`);
  }

  // get tracked exercise
  getTrackedExercise(exerciseId: number): Observable<ExerciseItem> {
    const key = `trackedFor${exerciseId}`;
    if (this.cache.has(key)) {
      return of(this.cache.get<ExerciseItem>(key)!);
    }
    return this.http.get<ExerciseItem>(`${this.baseUrl}/v1/exercises/${exerciseId}`) .pipe(
      tap(data => this.cache.set<ExerciseItem>(key, data)),
      catchError(err => {
        this.cache.delete(key);
        throw err;
      })
    );
  }

  // exercise
  getExercise(exerciseId: number): Observable<ExerciseItem> {
    const key = `exerciseFor${exerciseId}`;
    // if (this.cache.has(key)) {
    //   return of(this.cache.get<ExerciseItem>(key)!);
    // }
    return this.http.get<ExerciseItem>(`${this.baseUrl}/v1/exercises/${exerciseId}`) .pipe(
      // tap(data => this.cache.set<ExerciseItem>(key, data)),
      // catchError(err => {
      //   this.cache.delete(key);
      //   throw err;
      // })
    );
  }

  // exercises attemps
  exercisesAttempSave(data: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });
    return this.http.post(`${this.baseUrl}/v1/statustyping/save`, data, {headers});
  }

  sentContact(value: any) {
    return this.http.post(`${this.baseUrl}/v1/contactus`, value);
  }

  getUpgradePlans() {
    return this.http.get<UpgradePlan[]>(`${this.baseUrl}/v1/upgrade/plans`);
  }

  purchase(value: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });
    return this.http.post(`${this.baseUrl}/upgrade/purchase`, value, {headers});
  }

  getFirstExerciseOfLesson(lessonId: any) {
    const key = `exerciseFor${lessonId}`;
    if (this.cache.has(key)) {
      return of(this.cache.get<ExerciseItem>(key)!);
    }
    return this.http.get<ExerciseItem>(`${this.baseUrl}/v1/exercises/lessons/${lessonId}`) .pipe(
      tap(data => this.cache.set<ExerciseItem>(key, data)),
      catchError(err => {
        this.cache.delete(key);
        throw err;
      })
    );
  }

  postBlog(value: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });
    return this.http.post(`${this.baseUrl}/v1/admin/blogs`, value, {headers});
  }

  putBlog(id: number, value: BlogT) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });
    return this.http.put(`${this.baseUrl}/v1/admin/blogs/${id}`, value, {headers});
  }

  blogs(): Observable<BlogSafeT[]> {
    return this.http.get<BlogSafeT[]>(`${this.baseUrl}/v1/blogs`).pipe(
      map((blogs: BlogT[])=> blogs.map(blog => ({
        ...blog,
        short: findFirst(blog.htmlContent),
        rest: findRest(blog.htmlContent),
        expanded: false
      })))
    );
  }

  getBlog(id: string): Observable<BlogT> {
    return this.http.get<BlogT>(`${this.baseUrl}/v1/blogs/${id}`);
  }
}
