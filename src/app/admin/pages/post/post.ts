import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ApiService} from '../../../core/services/api-service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {findHeaders} from '../../../utils/paragraph';
import {QuillEditorComponent} from 'ngx-quill';

@Component({
  selector: 'app-post',
  imports: [
    FormsModule,
    RouterLink,
    QuillEditorComponent,
  ],
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class Post implements OnInit, OnChanges {
  id: string | null;
  body = {
    title: '',
    htmlContent: ""
  }
  headers: string[] = []

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute) {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    if (this.id != null) {
      this.api.getBlog(this.id!).subscribe(blog => {
        console.log(blog);
        this.body.title = blog.title;
        this.body.htmlContent = blog.htmlContent;
      });
    } else {
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  onSelectionChanged = (event: any) =>{
    if(event.oldRange == null){
      this.onFocus();
    }
    if(event.range == null){
      this.onBlur();
    }
  }

  onContentChanged = (event: any) =>{
    //console.log(event.html);
    this.detectHeaders();
  }

  onFocus = () =>{
    console.log("On Focus");
    this.detectHeaders();
  }
  onBlur = () =>{
    console.log("Blurred");
    this.detectHeaders();
  }

  protected postBlog() {
    const body = this.body;
    if (body.title.length > 0 && body.htmlContent.length > 0) {
      body.htmlContent = this.prepareContent(body.htmlContent);
      this.api.postBlog(this.body).subscribe((data: any) => {
        console.log(data);
        this.body = {
          title: '',
          htmlContent: ""
        };
      });
    } else {
      console.log("Properties are empty.");
    }
  }

  protected putBlog() {
    const body = this.body;
    if (body.title.length > 0 && body.htmlContent.length > 0 && this.id != null) {
      body.htmlContent = this.prepareContent(body.htmlContent);
      this.api.putBlog(this.id, this.body).subscribe((data: any) => {
        console.log(data);
        // this.body.next({
        //   title: '',
        //   htmlContent: ""
        // })
      });
    } else {
      console.log("Properties are empty.");
    }
  }

  protected prepareContent(htmlContent: string): string {
    htmlContent = htmlContent.replaceAll(/&nbsp;/g, ' ');
    htmlContent = htmlContent.replaceAll(/&#39;/g, '\'');
    htmlContent = htmlContent.replaceAll(/&quot;/g, '\"');
    return htmlContent;
  }

  protected updateContent(event: any) {
    const body = this.body;
    body.htmlContent = event.target.textContent;
    this.body = body;
    this.detectHeaders();
  }

  protected detectHeaders() {
    this.headers = findHeaders(this.body.htmlContent);
  }


}
