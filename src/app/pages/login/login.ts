import {Component, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {concatMap, first, of} from 'rxjs';

import {AuthService} from '../../core/services/auth-service';

import {ButtonDirective, ButtonLabel} from "primeng/button";
import {InputText} from 'primeng/inputtext';
import {Password} from 'primeng/password';
import {Message} from 'primeng/message';
import {MessageData} from '../../utils/helpers';
import {Dialog} from 'primeng/dialog';
import {IftaLabel} from 'primeng/iftalabel';
import {PrimeTemplate} from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    InputText,
    Password,
    ButtonDirective,
    ButtonLabel,
    Message,
    RouterLink,
    Dialog,
    IftaLabel,
    PrimeTemplate
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  message = signal<MessageData| null>(null);
  formData = {
    username: '',
    password: ''
  }
  constructor(private readonly authService:AuthService,
              private router: Router,) {
    // user name: sainaa3
    // pass: Bicheech@A9
  }

  onSubmit() {
    this.authService.login(this.formData)
      .pipe(
        first(),
        concatMap(async () => this.authService.fetchUserData().subscribe({
          next: value => {}
        }))
      )
      .subscribe({
        next: () => {
          // get return url from route parameters or default to '/'
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.message.set( {
            type: 'error',
            message: 'Нэвтрэх нэр эсвэл нууц үг буруу байна'
          });
        }
      });
  }

  goToForgotPassword() {
    this.forgotDialogVisible = true;
  }

  forgotDialogVisible = false;
  forgotEmail = '';
  forgotError = '';
  forgotLoading = false;

  sendResetEmail() {
    this.forgotError = '';
    this.forgotLoading = true;

    // fake validation example
    if (!this.forgotEmail || !this.forgotEmail.includes('@')) {
      this.forgotError = 'Email is required';
      this.forgotLoading = false;
      return;
    }

    this.authService.sendResetEmail(this.forgotEmail).subscribe({
      next: () => {
        this.forgotDialogVisible = false;
        this.forgotError = '';
        this.forgotEmail = '';

        this.message.set({
          type: 'success',
          message: 'Нууц үг солих заавар таны и-мэйл хаяг руу амжилттай илгээгдлээ.'
        });
        this.forgotLoading = false;
      },
      error: (err) => {
        // Backend message авах
        console.error(err);
        setTimeout(() => {
          this.forgotError = err?.error?.message ||
            'Алдаа гарлаа. Дахин оролдоно уу.';
        }, 0);
        this.forgotLoading = false;
      }
    });
  }
}
