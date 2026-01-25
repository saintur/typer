import {Component, computed, resource, ResourceRef, signal} from '@angular/core';
import {Composer} from "../../components/composer/composer";
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ApiService} from '../../core/services/api-service';
import {firstValueFrom} from 'rxjs';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-typing',
  imports: [
    Composer,
    Button,
    RouterLink
  ],
  templateUrl: './typing.html',
  styleUrl: './typing.scss',
})
export class Typing {
  timer = false;
  lessonId = signal<number|null>(null);

  constructor(private activatedRoute: ActivatedRoute, private api: ApiService) {
    activatedRoute.queryParams.subscribe(params => {
      const {timer, lesson} = params;
      if (timer === 'on') {
        this.timer = true;
      }

      if (lesson) {
        this.lessonId.set(lesson);
      }
    })
  }

  exerciseResource = resource({
    params: () => {
      const id = this.lessonId();
      if (!id) return undefined;
      return { id };
    },
    loader: async ({ params }) =>  {
      return firstValueFrom(this.api.getTrackedExercise(params.id))
    }
  })

  get current() {
    return this.exerciseResource.value()!;
  }

  get text() {
    return this.current.text;
  }

  get title() {
    return this.current ? this.current.mnTitle : 'Practice';
  }

}
