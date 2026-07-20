import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api-service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { WsapiService } from '../../core/services/wsapi-service';
import {AsyncPipe, CommonModule} from "@angular/common";
import { ButtonModule } from "primeng/button";
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { Composer } from '../../components/composer/composer';
import { FinishedData } from '../../utils/helpers';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {SecondsPipe} from '../../pipes/seconds-pipe';
import {AuthService} from '../../core/services/auth-service';

interface RaceRoom {
  createdAt: string | null;
  finishedAt: string | null;
  hostUserId: string;
  isExistsed: boolean;
  isFinished: boolean;
  isStarted: boolean;
  objRoomForUser: RaceUser[];
  roomId: string;
  startedAt: string | null;
  exerciseDTO: Lesson;
}

interface RaceUser {
  Score: string;
  createdAt: string;
  finishedAt: string;
  hostRoomId: string;
  isExistsed: boolean;
  isFinished: boolean;
  status: string;
  userId: string;
  userName: string;
  wpm: number;
}

interface Lesson {
  enHelpText: string;
  enTitle: string;
  id: number;
  mnHelpText: string;
  mnTitle: string;
  text: string;
}

@Component({
  selector: 'app-competing',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MessageModule,
    CardModule,
    ButtonModule,
    DialogModule,
    ProgressBarModule,
    AvatarModule,
    TagModule,
    InputTextModule,
    Composer,
    AsyncPipe,
  ],
  templateUrl: './competing.html',
  styleUrl: './competing.scss',
})

export class Competing implements OnInit, OnDestroy {

  wallOfFame: any;
  languageId = 'MONGOLIA';
  users!: RaceRoom; // not fitting nameing it should be "race room info"
  yourToken:string = '';
  roomId:string = '';
  counDown = 10;
  startInterval: any;
  startStr = signal<string|null>('Waiting for competitors...');
  lessons = signal<any|null>(null);
  dialogStart: boolean = true;
  titleStr = signal<string|null>( 'The race is about to start!');
  interval: any;

  timeTricker = 0;
  timeLimit$ = new BehaviorSubject<number>(90);
  minutes = 0;
  seconds = 0;
  strTime = '';
  wpm = 0;
  wordIndex = 0;

  words: string[] = [];

  accuracy = 100;
  errors = 0;
  showRsult = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private webSocketAPI: WsapiService,
    private readonly authService: AuthService,
  ) {
    this.route.params.subscribe(params => {
      this.languageId = params['lang'] ? String(params['lang']) : 'MONGOLIA';
    });

  }

  ngOnInit(): void {
    this.webSocketAPI.registerComponent(this);
    this.webSocketAPI.id = this.roomId;
    this.webSocketAPI._connect(this.languageId, true);

    window.onbeforeunload = () => {
      this.ngOnDestroy();
    };
  }

  ngOnDestroy(): void {
    if (this.startInterval) {
      clearInterval(this.startInterval);
    }

    if (this.interval) {
      clearInterval(this.interval);
    }

    if (this.webSocketAPI) {
      this.webSocketAPI._sendPrivate("/app/private-close/"+this.roomId , "Guest has leaved the racetrack.");
      this.webSocketAPI._disconnect();
    }
    window.onbeforeunload = null;

  }

  endExercise(data: FinishedData) {
    console.info('endExercise');
    this.stopTimer();
    this.titleStr.set('The race has ended.');
    this.showRsult = true;
    this.lessons.set(null);
    this.wpm = this.getWpm(data);
    this.sendRaceProcess("finish");


    console.info('saveExercise');
    const payload = {
      exerciseId: this.users.exerciseDTO.id,
      lessonId: this.lessons().lessonId,
      ...data
    };

    if (this.authService.isLoggedIn()) {
      this.api.exercisesAttempSave(payload).subscribe({});
    }
  }

  getMembers(): any[] {
    console.log(this.users);
    // too much calling / running. Why?
    if (!this.users || !this.users.objRoomForUser) {
      return [];
    }
    return this.users.objRoomForUser;
  }

  isMe(member: any): boolean {
    return member?.userId === this.yourToken;
  }

  setUserToken(member: string): void {
    this.yourToken = member;
  }

  handlePrivateMessage(message: any): void {
    // private message handle хийх бол энд бичнэ
  }

  handlePrivateMember(message: RaceRoom): void {
    console.log(message);
    if (this.roomId === '') {
      this.roomId = message.roomId;
      this.webSocketAPI.id = this.roomId;
      //this.webSocketAPI._sendPrivate("/app/send-text/"+this.roomId , "Welcome to \"Guest's Racetrack\".");
      //this.webSocketAPI._sendPrivate("/app/send-text/"+this.roomId , "Guest has entered the racetrack.");
    }

    this.users = message;
    this.startStr.set('Waiting for competitors...');
    this.dialogStart = false;
    console.log(message?.startedAt);
    if (message?.startedAt) {

      const startDatetime = new Date(message.startedAt);
      const startTimeInMilliseconds = startDatetime.getTime() + 10000;
      const now = new Date();
      const initialTimeInMilliseconds = now.getTime();
      const targetTimeInMilliseconds = startTimeInMilliseconds - initialTimeInMilliseconds;

      this.counDown = Math.max(Math.ceil(targetTimeInMilliseconds / 1000), 0);
      this.dialogStart = true;
      if (
        this.dialogStart &&
        this.users?.objRoomForUser?.length > 1 &&
        !this.startInterval
      ) {
        const index = this.users.objRoomForUser.findIndex(u => u.userId === this.yourToken);
        if(!this.users.objRoomForUser[index].isFinished) {
          this.lessons.set(message.exerciseDTO);
        }
        this.startInterval = setInterval(() => {
          this.counDown = Math.max(this.counDown - 1, 0);
          this.startStr.set('Waiting for competitors... ' + this.counDown);
          if (this.counDown === 0) {
            clearInterval(this.startInterval);
            this.startInterval = null;
            this.dialogStart = false;
            this.titleStr.set('The race is on! Type the text below:');
            this.startTimer();
          }
        }, 1000);
      }
    }
  }

  handlePrivateError(message: any): void {
    if (this.webSocketAPI) {
      this.webSocketAPI._disconnect();
    }
  }

  leave(): void {
    if (this.webSocketAPI) {
      this.webSocketAPI._disconnect();
    }
    this.router.navigateByUrl('/');
  }

  sendRaceProcess(process: 'process' | 'finish'): void {
    const denominator =
      process === 'finish'
        ? Math.max(this.words.length - 1, 1)
        : Math.max(this.words.length, 1);
    const body = {
      process,
      percent: (this.wordIndex * 100) / denominator,
      score: this.wpm,
      wpm: this.wpm,
      roomId: this.roomId,
      userId: this.yourToken,
    };
    console.log(body);
    this.webSocketAPI._sendProcess('/app/updatemembers/' + this.roomId, body);
  }

  tryAgain(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.titleStr.set('The race is about to start!');
    this.strTime = '';
    this.timeTricker = 0;
    this.counDown = 10;
    this.dialogStart = true;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  }

  startTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      const currentTime = this.timeLimit$.value;
      if (currentTime <= 0) {
        this.stopTimer();
        this.titleStr.set('The race has ended.');
        this.showRsult = true;
        return;
      }
      this.timeLimit$.next(currentTime - 1);
    }, 1000);
  }

  stopTimer(): void {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  getWpm(data: FinishedData) {
    if (data.timeSeconds === 0) return 0;
    return ((data.typedChars  / data.typedChars) / (data.timeSeconds/60)) * data.accuracy;
  }
}
