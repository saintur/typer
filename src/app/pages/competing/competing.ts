import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ApiService} from '../../core/services/api-service';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Dialog} from 'primeng/dialog';
import {WsapiService} from '../../core/services/wsapi-service';

@Component({
  selector: 'app-competing',
  imports: [ReactiveFormsModule, RouterLink, Dialog],
  templateUrl: './competing.html',
  styleUrl: './competing.scss',
})
export class Competing implements OnInit, OnDestroy {
  lessons: any;
  languageId: String = "MONGOLIA";
  dialogUrlRoom: boolean = false;
  isTimeout: boolean = false;
  hostUser: String = "";
  private timeIsRunning: boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private api: ApiService) {
    this.route.params.subscribe(params => {
      this.languageId = params['lang']+ "";
    });
    this.route
      .queryParams
      .subscribe(params => {
        this.roomId = params['id'] || "";
      });

  }

  ngOnInit(): void {
    const  __this = this;
    this.webSocketAPI = new WsapiService(this);
    this.webSocketAPI.id = this.roomId;

    this.webSocketAPI._connect(this.languageId);

    //This is a very elegant method - for a single component.
    window.onbeforeunload = () => this.ngOnDestroy();
  }

  // start track list
  users:any;
  yourToken : string = "";
  webSocketAPI!: WsapiService;
  roomId: string = '';
  counDown = 10;
  startInterval: any;
  startStr: String = "";
  dialogStart: boolean = true;
  titleStr: String = "The race is about to start!"

  getMembers(): any {
    if(this.users == undefined)
      return [];
    return this.users.objRoomForUser;
  }

  getBaseUrl(): string {
    return location.href;
  }

  isMe(member: any): boolean{
    if(member["userId"]==this.yourToken)
      return true;
    return false;
  }

  ngOnDestroy(): void {
    this.webSocketAPI._disconnect();
    //throw new Error('Method not implemented.');
  }

  setUserToken(member: string): void {
    this.yourToken = member
  }

  handlePrivateMessage(message: any) {

  }

  isHost(): boolean {
    if(this.yourToken==this.hostUser) {
      return true;
    }
    return false;
  }

  open(): void {
    this.dialogUrlRoom = true;
  }

  handlePrivateMember(message: any){
    if(this.roomId == "") {
      this.roomId=message.roomId;
      console.log(this.roomId);

      this.webSocketAPI.id = this.roomId;
      this.webSocketAPI._sendPrivate("/app/send-text/"+this.roomId , "Welcome to \"Guest's Racetrack\".");
      this.webSocketAPI._sendPrivate("/app/send-text/"+this.roomId , "Guest has entered the racetrack.");
    }

    this.users  = message;
    this.hostUser=message.hostUserId;
    this.dialogStart=message.isStarted;
    if(this.dialogStart && !this.timeIsRunning) {
      this.dialogUrlRoom = false;
    }

    this.startStr = "Waiting for competitors... "
    if(this.dialogStart && !this.timeIsRunning && this.users['objRoomForUser'].length > 1) {
      this.startInterval = setInterval(() => {
        this.counDown = this.counDown - 1;
        this.startStr = "Waiting for competitors... " + this.counDown;
        if(this.counDown == 0) {
          clearInterval(this.startInterval);
          this.dialogStart = false;
          this.counDown = 4;
          this.startStr = "Waiting for competitors... " + this.counDown;
          this.timeIsRunning = true;
          this.startTimer();
        }

      },1000);
    }
  }

  handlePrivateError(message: any): void {
    this.webSocketAPI._disconnect();
  }

  leave(): void {
    this.webSocketAPI._disconnect();
    this.router.navigateByUrl('/competing');
  }

  // end track list

  // start time ticker

  interval: any;
  timeTricker: number = 0;
  timeLimit: number = 120;
  minutes: number = 0;
  seconds: number = 0;
  strTime: string = "";
  wpm = 0;

  startTimer() {
    //this.characters = 0;
    //console.log("this.characters is getting zero");
    this.interval = setInterval(() => {
      if (this.timeTricker <= this.timeLimit) {
        this.minutes = Math.floor((this.timeLimit - this.timeTricker)/60);
        this.seconds = (this.timeLimit - this.timeTricker)-(this.minutes*60);
        this.strTime = this.minutes +":"+ this.seconds.toString().padStart(2, '0');
        this.timeTricker +=1;
      } else {
        clearInterval(this.interval);
        this.titleStr = "The race has ended.";
        this.strTime = "";
      }

    },1000)
  }

  // end time ticker

  // start writer form
  playSounds = true;
  wordIndex = 0;
  totalLetter = 0;
  letterIndex = 0;
  words: any;
  formGroup!: FormGroup;
  wrote = new FormControl("");
  timer: any = 0;
  accuracy:number = 100;
  typingProcess: any = [];
  characters: number = 0;
  errors: number = 0;
  hasError: boolean = false;

  initForm(): void {
    this.words = this.lessons.tutor.split(" ").map((word: string, index: number, array: any) => {
      //to do: if it is last, it will return without space.
      return index === array.length -1 ? word : word + " ";
    });
    this.formGroup = new FormGroup({
      wrote: new FormControl("")
    });
    this.formGroup.valueChanges.subscribe(change => {
      this.onChange(change.wrote);
    });
    this.words.forEach((word: any) => {
      this.totalLetter += word.length;
      this.typingProcess.push({word, status: 'unknown', letters: []});
    });
  }

  getLetters(word: string) {
    return word.split("");
  }

  get currentWrote() {
    return this.formGroup.controls['wrote'].value;
  }

  setCurrentWrote(text: string) {
    this.formGroup.controls['wrote'].setValue(text);
  }

  onBackspace() {
    if (this.currentWrote.length < this.words[this.wordIndex].length) {
      this.typingProcess[this.wordIndex].letters = this.typingProcess[this.wordIndex].letters.slice(0, this.currentWrote.length);
    }
  }

  hasAnyMistakeInText(): boolean {
    const allTrue: boolean = this.typingProcess[this.wordIndex].letters.every((item: boolean) => item === true);
    if (this.currentWrote == ''){
      return false;
    }
    return !allTrue;
  }

  onSpace() {
    const allTrue: boolean = this.typingProcess[this.wordIndex].letters.every((item: boolean) => item === true);
    console.log(allTrue);
    if(!allTrue) return;

    if (this.currentWrote.length === this.words[this.wordIndex].length) {
      this.wordIndex++;
      this.letterIndex = 0;
      this.setCurrentWrote('');
    }

    let result = document.getElementsByClassName("word-" + this.wordIndex) as HTMLCollection;
    for (let i=0; i < result.length; i++) {
      const spanElement = result.item(i) as HTMLSpanElement;
      let box =  (document.getElementsByClassName("typing-box") as HTMLCollection)[0] as HTMLDivElement;
      let inp =  (document.getElementsByClassName("inp_text") as HTMLCollection)[0] as HTMLInputElement;
      inp.style.top = spanElement.offsetTop+'px';
      box.scrollTop = spanElement.offsetTop;
    }

    const body = {
      process: 'process',
      percent: (this.wordIndex * 100) / this.words.length,
      score: this.wpm,
      wpm: this.wpm,
      roonId: this.roomId,
      userId: this.yourToken
    };
    this.webSocketAPI._sendProcess("/app/updatemembers/"+this.roomId, body);
  }

  onChange(wrote: string) {
    var isTheLast = false;

    console.log("wrote" + wrote);
    if (wrote !== '') {
      console.log("add characters" + this.characters);
      this.characters++;
    }

    const letterIndex = wrote.length - 1;
    if (wrote.length <= this.words[this.wordIndex].length) {
      if (wrote === this.words[this.wordIndex].substr(0, wrote.length)) {
        this.typingProcess[this.wordIndex].status = "right";
      } else {
        this.typingProcess[this.wordIndex].status = "wrong";
        this.errors++;
        // make sound
        this.playSound();
      }

      if (letterIndex !== -1) {
        wrote[letterIndex] === this.words[this.wordIndex][letterIndex] ?
          this.typingProcess[this.wordIndex].letters[letterIndex] = true :
          this.typingProcess[this.wordIndex].letters[letterIndex] = false;
      }
    } else {

      //this.formGroup.controls['wrote'].setValue(wrote.substr(0, this.words[this.wordIndex].length));
    }
    //console.log(this.formGroup);
    // Calculate Accuracy
    this.accuracy = 100-Math.round((this.errors/this.characters)*100);
    // Calculate WPM
    this.wpm = this.calculateSpeed( this.characters, this.timeTricker, this.errors);
    //this.lwpm += this.wpm;

    if (this.words.length - 1 === this.wordIndex && this.currentWrote.length === this.words[this.wordIndex].length) {
      console.log("this is the last movement"+(this.wordIndex * 100) / (this.words.length -1));
      clearInterval(this.interval);
      const body = {
        process: 'finish',
        percent: (this.wordIndex * 100) / (this.words.length -1),
        score: this.wpm,
        wpm: this.wpm,
        roonId: this.roomId,
        userId: this.yourToken
      };
      this.webSocketAPI._sendProcess("/app/updatemembers/"+this.roomId, body);
    } else {



    }
  }

  speedType: string = "wpm";

  calculateSpeed(characters: number, seconds: number, errors: number) {
    var words, minutes, speed;
    if (this.speedType == "kph") {
      speed = Math.round(characters / seconds * 3600);
    } else if (this.speedType == "wpm") {
      words = (characters - (errors * 5)) / 5;		// begin WPM calculation
      minutes = seconds / 60;
      speed = Math.max(Math.round(words / minutes), 0);
    } else {
      words = (characters - (errors * 5));		// begin WPM calculation
      minutes = seconds / 60;
      speed = Math.max(Math.round(words / minutes), 0);
    }
    return (speed == Infinity) ? 100 : speed;
  }

  playSound() {
    if (!this.playSounds) return;

    if (navigator.userAgent.match(/MSIE 10/)) {
      return
    }
    new Audio('../../../assets/audio/fail.mp3').play();
  }

  // end writer form
  showRsult: boolean = false;
}
