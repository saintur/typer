import {Component} from '@angular/core';
import {ApiService} from '../../core/services/api-service';
import {Observable} from 'rxjs';
import {AsyncPipe, DatePipe} from '@angular/common';

export type BlogT = {
  id: number;
  title: string;
  htmlContent: string;
  createdAt: Date;
  createdBy: string;
  lastModifiedAt: Date;
  lastModifiedBy: string;
}

export type BlogSafeT = BlogT & {
  short: string;
  rest: string;
  expanded: boolean;
}

@Component({
  selector: 'app-blog',
  imports: [
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog {
  blogs$!: Observable<BlogSafeT[]>;

  constructor(private api: ApiService) {
    this.blogs$ = this.api.blogs();
  }
}
