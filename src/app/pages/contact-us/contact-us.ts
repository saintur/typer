import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MessageData } from '../../utils/utils';
import { ApiService } from '../../core/services/api-service';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import {RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings} from 'ng-recaptcha-2';
import {environment} from '../../../environments/environment';
import {TypingLayout} from '../../components/typing-layout/typing-layout';

@Component({
  selector: 'app-contact-us',
  imports: [
    Button,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    Message,
    TypingLayout
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
  message!: MessageData;

  constructor(private readonly contactService: ApiService) {
  }

  onSubmit() {
    this.contactService.sentContact(this.contactForm.value).subscribe({
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
