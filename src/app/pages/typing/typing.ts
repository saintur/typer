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
      this.nextExercise();
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

  nextExercise(): void {
    console.info('nextExercise');
    this.saveExercise();

    const nextId = this.current?.next;
    if (nextId && nextId !== this.lessonId()) {
      this.lessonId.set(Number(nextId));
    }
  }

  endExercise(data: any) {
    console.info('endExercise');
    // will remove
    // this.stats.push(this.generateTypingStats());
    // this.accuracy = this.stats[this.stats.length-1].accuracy;
    // console.log(this.stats);

    // this.data = {
    //   ...this.data,
    //   datasets: [
    //     {
    //       ...this.data.datasets[0],
    //       data: this.data.datasets[0].data.map((v: any, i: number) =>
    //         i === this.exerciseNum ? this.netSpeed : v
    //       )
    //     }
    //   ]
    // };

    // // Accuracy limit
    // var accLimit = this.exercises[this.exerciseNum].accuracyLimit;
    // if (accLimit > 0 && Math.round((this.errors/this.characters)*100) > accLimit) {
    //   this.alertService.alert(
    //     text.EXERCISE_FAILURE,
    //     text.FAILURE_ACCURACY
    //   );
    // }
    // // Speed limit
    // var speedLimit = this.exercises[this.exerciseNum].speedLimit;
    // if (speedLimit > 0 && this.calculateSpeed(this.characters, this.seconds, this.errors) < speedLimit) {
    //   this.alertService.alert(
    //     text.EXERCISE_FAILURE,
    //     text.FAILURE_SPEED
    //   );
    // }
    // // Time limit
    // var timeLimit = this.exercises[this.exerciseNum].examTime;
    // if (timeLimit > 0 && this.seconds > timeLimit) {
    //   this.alertService.alert(
    //     text.EXERCISE_FAILURE,
    //     text.FAILURE_TIME
    //   );
    // }

    // if (localStorage.getItem(this.STORAGE_KEY) !== 'true') {
    //   this.showProcessWin();
    // } else {
      this.nextExercise();
    // }
  }

  saveExercise(): void {
    // if authed
    // this.apiService.exercisesAttempSave({   typedChars: this.typedChars,
    //   correctChars: this.typedChars,
    //   timeSeconds: this.timeSeconds,
    //   exerciseId: this.exercises[this.exerciseNum].id }).subscribe({});

  }
}
