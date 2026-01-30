import {Component, computed, resource, ResourceRef, signal} from '@angular/core';
import {Composer} from "../../components/composer/composer";
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ApiService} from '../../core/services/api-service';
import {firstValueFrom} from 'rxjs';
import {Button} from 'primeng/button';
import {AuthService} from '../../core/services/auth-service';

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
  exerciseId = signal<number|null>(null);
  exerciseData: {
    typedChars: number,
    correctChars: number,
    timeSeconds: number,
    missedKeys: Record<string, number>,
    accuracy: number
  } = {
    typedChars: 0,
    correctChars: 0,
    timeSeconds: 0,
    missedKeys: {},
    accuracy: 0
  };

  constructor(private activatedRoute: ActivatedRoute,
              private readonly api: ApiService,
              private readonly authService: AuthService,) {
    activatedRoute.queryParams.subscribe(params => {
      const {timer, lesson} = params;
      if (timer === 'on') {
        this.timer = true;
      }

      if (lesson) {
        this.lessonId.set(lesson);
        this.api.getFirstExerciseOfLesson(lesson).subscribe({
          next: result => {
            if(result !== null) {
              this.exerciseId.set(result.id);
            }
          }
        });
      }
    })
  }

  exerciseResource = resource({
    params: () => {
      const id = this.exerciseId();
      if (!id) return undefined;
      return { id };
    },
    loader: async ({ params }) =>  {
      if (!params?.id) return null;
      return firstValueFrom(this.api.getExercise(params.id))
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
    if (nextId && nextId !== this.exerciseId()) {
      this.exerciseId.set(Number(nextId));
    }
  }

  endExercise(data: { typedChars: number, correctChars: number, timeSeconds: number, missedKeys: any, accuracy: number }) {

    console.info('endExercise');
    this.exerciseData = data;
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
    console.info('saveExercise');
    console.info(this.exerciseData);
    const payload = {
      exerciseId: this.current.id,
      lessonId: this.lessonId(),
      ...this.exerciseData
    };

    if(this.authService.isLoggedIn()) {
      this.api.exercisesAttempSave(payload).subscribe({});
    }

  }
}
