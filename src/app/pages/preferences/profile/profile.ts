import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Message} from 'primeng/message';
import {InputText, InputTextModule} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {DatePicker} from 'primeng/datepicker';
import {Observable} from 'rxjs';
import {Select} from 'primeng/select';
import {MessageData, User} from '../../../utils/helpers';
import {AuthService} from '../../../core/services/auth-service';
import {Divider} from 'primeng/divider';

@Component({
  selector: 'app-profile',
  imports: [
    Button,
    ReactiveFormsModule,
    Message,
    InputText,
    DatePicker,
    InputTextModule,
    Select,
    Divider
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  user$!: Observable<User | null>;
  message!: MessageData;
  genders = [ { label: 'Эмэгтэй', value: 'F' },
    { label: 'Эрэгтэй', value: 'M' },
  ];

  public profileForm: FormGroup = new FormGroup({
    'username': new FormControl(
      "",
      {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(40),
        ]}),
    'email': new FormControl(
      "",
      {
        validators: [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ]}),
    'firstname': new FormControl(
      "",
      {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(120)
        ]}),
    'lastname': new FormControl(
      "",
      {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(120)
        ]}),
    'birthday': new FormControl(
      "",
      {
        validators: [
          Validators.required
        ]}),
    'gender': new FormControl(
      "",
      {
        validators: [
          Validators.required
        ]})
  });

  constructor(private readonly authService: AuthService,) {
    this.user$ = this.authService.$User;
    this.user$.subscribe((user : User|null) => {
      this.profileForm.patchValue({
        username: user?.username,
        email: user?.email,
        firstname: user?.firstname,
        lastname: user?.lastname,
        birthday: user?.birthday,
        gender: user?.gender
      });
    });
  }

  profileSubmit() {
    // if (this.profileForm.invalid) {
    //   this.message = {
    //     type: 'error',
    //     message: 'Please fix the errors below.'
    //   };
    //   this.profileForm.markAllAsTouched();
    //   return;
    // };

    this.authService.changeProfile(this.profileForm.value).subscribe({
        complete: (() => {

        }),
        error: ((err: any) => {
          this.message = {
            type: 'error',
            message: 'Өгөгдөлийг хадгалахад алдаа гарлаа'
          };
        }),
        next: ((res: any) => {
          this.message = {
            type: 'success',
            message: res['message']
          };
        })

      }
    );
  }

  ngOnInit(): void {
  }
}
