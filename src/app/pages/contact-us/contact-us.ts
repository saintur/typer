import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {Card} from 'primeng/card';
import {Textarea} from 'primeng/textarea';
import {InputText} from 'primeng/inputtext';

import {Header} from "../../components/header/header";
import {messageData} from '../../utils/helpers';
import {ApiService} from '../../core/services/api-service';
import {environment} from '../../../environments/environment';

import {RECAPTCHA_SETTINGS, RecaptchaModule, RecaptchaFormsModule, RecaptchaSettings} from 'ng-recaptcha-2';
import {Message} from 'primeng/message';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-contact-us',
  imports: [
    Header,
    Card,
    ReactiveFormsModule,
    RecaptchaFormsModule,
    Textarea,
    InputText,
    RecaptchaModule,
    Message,
    Button,
  ],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.scss',
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings
    }
  ]
})
export class ContactUs {
  token: string|undefined;
  contactForm: FormGroup = new FormGroup({
    name: new FormControl('',{
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(40)
      ]
    }),
    email: new FormControl(
      '',
      {
        validators: [
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(40),
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ]}),
    content: new FormControl('', {
      validators: [Validators.minLength(3), Validators.maxLength(800), Validators.required]
    }),
    recaptcha: new FormControl(
      '',
      {
        validators: [
          Validators.required,
        ]})
  });
  message!: messageData;

  constructor(private readonly apiService: ApiService) {
  }

  onSubmit() {
    this.apiService.sentContact(this.contactForm.value).subscribe({
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
    });
  }
}
