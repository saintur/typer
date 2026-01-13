import {Component} from '@angular/core';
import {Button} from 'primeng/button';
import {Header} from '../../components/header/header';
import {TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion';
import {Badge} from 'primeng/badge';
import {NgTemplateOutlet} from '@angular/common';
import {Tag} from 'primeng/tag';
import {ApiService} from '../../core/services/api-service';
import {LessonItem} from '../../utils/helpers';
import {Progress} from '../../components/progress/progress';
import {RouterLink} from '@angular/router';

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
    RouterLink
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
  lessons: LessonItem[] = [];

  constructor(private readonly apiService: ApiService) {

    this.apiService.getAllLessons().subscribe({
      next: data => {
        this.lessons = data;
      }
    });
  }

}
