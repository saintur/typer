import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../core/services/api-service';
import {Observable} from 'rxjs';
import {AsyncPipe, DatePipe, Location} from '@angular/common';
import {BlogT} from '../blog/blog';

@Component({
  selector: 'app-blog-details',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.scss',
})
export class BlogDetails {
  blog$: Observable<BlogT> | undefined;

  constructor(private api: ApiService, private route: ActivatedRoute, private location: Location) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.blog$ = this.api.getBlog(id);
  }

  goBack(): void {
    this.location.back();
  }
}
