import {Component} from '@angular/core';
import {ApiService} from '../../core/services/api-service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
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
  shortContent: string;
  htmlContent: SafeHtml;
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
  blogs$!: Observable<BlogT[]>;

  constructor(private api: ApiService,
              private sanitizer: DomSanitizer) {
    this.blogs$ = this.api.blogs();
  }
}
