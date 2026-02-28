import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {QuillEditorComponent} from 'ngx-quill';
import {ButtonDirective} from 'primeng/button';
import {ApiService} from '../../../core/services/api-service';
import {Textarea} from 'primeng/textarea';

@Component({
  selector: 'app-post',
  imports: [
    FormsModule,
    QuillEditorComponent,
    ButtonDirective,
    Textarea,
  ],
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class Post {
  body = {
    title: '',
    htmlContent: "<p>fdasfdas</p>"
  }
  htmlContent = "<p>fdasfdas</p>";
  titleEdit = false;
  hasFocus = false;

  constructor(private api: ApiService) {
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
  }

  onFocus = () =>{
    console.log("On Focus");
  }
  onBlur = () =>{
    console.log("Blurred");
  }

  protected postBlog() {
    console.log(this.body);
    if (this.body.title.length > 0 && this.body.htmlContent.length > 0) {
      this.body.htmlContent = this.body.htmlContent.replaceAll(/&nbsp;/g, ' ');
      this.body.htmlContent = this.body.htmlContent.replaceAll(/&#39;/g, '\'');
      this.body.htmlContent = this.body.htmlContent.replaceAll(/&quot;/g, '\"');
      this.api.postBlog(this.body).subscribe((data: any) => {
        console.log(data);
        this.body.title = '';
        this.body.htmlContent = '';
      });
    } else {
      console.log("Properties are empty.");
    }
  }

  protected updateTitle(event: any) {
    this.body.title = event.target.textContent
  }

  protected updateContent(event: any) {
    // console.log("Content changed", event.target.textContent);
    this.body.htmlContent = event.target.textContent;
  }
}
