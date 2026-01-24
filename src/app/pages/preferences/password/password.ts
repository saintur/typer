import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {InputTextModule} from 'primeng/inputtext';
import {PasswordDirective} from 'primeng/password';
import {Message} from 'primeng/message';
import {Divider} from 'primeng/divider'
import {Button} from 'primeng/button';

import {AuthService} from '../../../core/services/auth-service';
import {messageData} from '../../../utils/helpers';

@Component({
  selector: 'app-password',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    Button,
    PasswordDirective,
    Message,
    Divider,
  ],
  templateUrl: './password.html',
  styleUrl: './password.scss',
})
export class Password {
  message!: messageData;
  form: FormGroup = new FormGroup({
    currentPassword: new FormControl(
      "",
      {
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(120)
        ]}),
    newPassword: new FormControl(
      "",
      {
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(120)
        ]}),
    confirmPassword: new FormControl(
      "",
      {
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(120)
        ]})
  });
  constructor(private authService: AuthService) {
  }

  changePasswordSubmit() {

    this.authService.changePassword(this.form.value).subscribe({
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

    });

  }
}
