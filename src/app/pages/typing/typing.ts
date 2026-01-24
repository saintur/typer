import {Component, OnInit, signal} from '@angular/core';
import {Composer} from "../../components/composer/composer";
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../core/services/api-service';
import {combineLatest, switchMap, tap} from 'rxjs';
import {calculateTypingStats, ExerciseItem, LessonItem, text, TypingResult} from '../../utils/helpers';
import {Dialog} from 'primeng/dialog';
import {Card} from 'primeng/card';
import {ProgressBar} from 'primeng/progressbar';
import {Checkbox} from 'primeng/checkbox';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-typing',
  imports: [
    Composer,
    Dialog,
    Card,
    ProgressBar,
    Checkbox,
    Button
  ],
  templateUrl: './typing.html',
  styleUrl: './typing.scss',
})
export class Typing implements OnInit {
  stopPopup = false;
  private readonly STORAGE_KEY = 'STOP_EXERCISE_POPUP';

  timer = false;

  lang: any;
  category: number = 0;
  lessonId: number = 0;

  text = text;

  helpTitle:string | undefined = "";
  helpIntro: string | undefined = "";

  // intro popup window
  visibleIntro = signal<boolean>(false);
  // process popup window
  visibleProcess = signal<boolean>(false);

  exercises: ExerciseItem[] = [];
  lessons: LessonItem[] = [];
  exerciseNum: number = 0;

  acceptingInput : boolean = false;

  speedType: string = 'WPM';
  timeSeconds: number = 0;
  typedChars: number = 0;
  typedStatus!: TypingResult;

  data: any = {
    labels: [],
    datasets: [
      {
        type: 'line',
        label: '',
        backgroundColor: 'rgba(37, 198, 208, 0.5)',
        borderColor: '#25c6d0',
        borderWidth: 1,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.1,
        data: []
      }
    ]
  };
  options : any = {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: {
          callback: () => '●',   // circular point instead of text
          color: '#25c6d0',
          font: {
            size: 12
          }
        },
        grid: {
          display: false,
        }
      },
      y: {
        display: false,
        grid: {
          display: false,
        }
      }
    }
  };
  visibleCongrats = signal<boolean>(false);

  constructor(private activatedRoute: ActivatedRoute,
              private readonly apiService: ApiService,
              private router: Router,) {}

  ngOnInit(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    this.stopPopup = saved === 'true';

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['timer'] === 'on') {
        this.timer = true;
      }
    });
    this.activatedRoute.params.pipe(
      tap(params => {
        this.lang = params['lang'];
        this.category = params['category'];
        this.lessonId = params['lesson'];
      }),
      switchMap(() => combineLatest([
        this.apiService.getCategory(this.category),
        this.apiService.getCategory(this.lessonId),
        this.apiService.getExercise(this.lang, this.lessonId)
      ]))
    ).subscribe(([category1, category2, exercises]) => {
      this.lessons.push(category1);
      this.lessons.push(category2);
      this.exercises = exercises;

      if (this.exercises.length === 0) {
        this.router.navigateByUrl('/').then();
      }

      this.intro();

      // chart opuulah talaar yariltsah
      //this.buildChart();

      //this.exercises[0].text = 'jjj';

      // for(let exercise of exercises) {
      //   if(exercise.text !== 'restricted') {
      //     console.log(exercise.text)
      //     this.typedChars = exercise.text.replaceAll('\n', ' ').replaceAll('\r', '').length;
      //     this.timeSeconds = Math.floor(this.typedChars * (this.randomInt(14, 17) / 100));
      //
      //     this.typedStatus = calculateTypingStats({
      //       typedChars: this.typedChars,
      //       correctChars: this.typedChars,
      //       timeSeconds: this.timeSeconds,
      //       speedType: this.speedType
      //     });
      //
      //     this.apiService.exercisesAttempSave({
      //       typedChars: this.typedChars,
      //       correctChars: this.typedChars,
      //       timeSeconds: this.timeSeconds,
      //       exerciseId: exercise.id
      //     }).subscribe({});
      //   }
      // }
    });

  }

  onStopPopupChange() {
    localStorage.setItem(this.STORAGE_KEY, String(!this.stopPopup));
  }

  randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  nextExercise(): void {
    console.info('nextExercise');
    this.saveExercise();
    this.exerciseNum++;

    if (this.exercises.length == this.exerciseNum || this.exercises[this.exerciseNum]?.text == "restricted") {	// lesson is over
      this.acceptingInput = false;
      this.congrats();
    } else {
      // this.initExercise();
      this.beginExercise();
    }
  }

  restartExercise(): void {
    console.info('restartExercise');
    this.apiService.restartLesson(this.lessonId)
      .subscribe({
        next: () => {
        },
        error: err => {
          console.error('Restart failed', err);
        }
      });
  }

  saveExercise(): void {
    // this.apiService.exercisesAttempSave({   typedChars: this.typedChars,
    //   correctChars: this.typedChars,
    //   timeSeconds: this.timeSeconds,
    //   exerciseId: this.exercises[this.exerciseNum].id }).subscribe({});

  }

  private intro() {
    let lesson = this.lessons.find(l => l.id === Number(this.lessonId));
    this.helpTitle = lesson?.mnTitle;
    this.helpIntro = lesson?.mnIntro;
    this.visibleIntro.set(true);
  }

  private showProcessWin() {
    this.typedChars = this.exercises[this.exerciseNum].text.replaceAll('\n', ' ').replaceAll('\r', '').length;
    this.timeSeconds = Math.floor(this.typedChars * (this.randomInt(14, 17) / 100));

    this.typedStatus = calculateTypingStats({
      typedChars: this.typedChars,
      correctChars: this.typedChars,
      timeSeconds: this.timeSeconds,
      speedType: this.speedType
    });
    this.visibleProcess.set(true);
  }

  private buildChart() {
    this.data = {
      labels: this.exercises.map((_, i) => (i + 1).toString()),
      datasets: [
        {
          type: 'line',
          label: '',
          backgroundColor: 'rgba(37, 198, 208, 0.5)',
          borderColor: '#25c6d0',
          borderWidth: 1,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 0,
          tension: 0.1,
          data: this.exercises.map(() => 0)
        }
      ]
    };
  }

  beginExercise() {
    console.info('beginExercise');
    this.visibleIntro.set(false);
    this.visibleProcess.set(false);

    if (this.exercises[this.exerciseNum]?.mnHelpText) {
      this.textSection();
      return;
    }

    this.acceptingInput = true;
  }

  goBack() {
    this.router.navigateByUrl('/tutor/'+this.lang).then(r  => {});
  }

  congrats() {
    console.info('congrats');
    let lesson = this.lessons.find(l => l.id === Number(this.lessonId));
    this.helpTitle = 'Баяр хүргэе';
    this.helpIntro = lesson?.mnCongrats;
    if(this.exercises[this.exerciseNum]?.text == "restricted") {
      this.helpTitle = 'Premium хичээлийг нээх';
      this.helpIntro = `<p class="typinghelp">Энэ нь нэмэлт хичээлийн богино <strong>танилцуулга</strong> байлаа. Бүрэн хичээл нь илүү урт бөгөөд илүү дэлгэрэнгүй.</p> <p class="typinghelp">   <a href="https://www.bicheech.mn/upgrade"><strong>Алтан гишүүнчлэлд</strong></a> шилжсэнээр бүх сурталчилгааг арилгаж, бүх нэмэлт контентыг нээж, имэйлийн давуу дэмжлэг авах боломжтой болно. </p> <br /> <p style="text-align:center" class="typinghelp">   <a href="http://www.bicheech.mn/upgrade" target="_top">БҮРТГЭЛ ШИНЭЧЛЭХ</a> </p>`;
    }

    this.visibleCongrats.set(true);
  }

  textSection() {
    console.info('textSection');

    this.helpTitle = this.exercises[this.exerciseNum].mnTitle;
    this.helpIntro = this.exercises[this.exerciseNum].mnHelpText;
    this.visibleIntro.set(true);

    this.exercises[this.exerciseNum].mnHelpText = '';
    this.exercises[this.exerciseNum].mnHelpText = '';
  }

  endExercise(data: any) {
    console.info('endExercise');
    console.info('data', data);
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

    if (localStorage.getItem(this.STORAGE_KEY) !== 'true') {
      this.showProcessWin();
    } else {
      this.nextExercise();
    }
  }
}
