import {Component, signal} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {Message} from "primeng/message";
import {Password} from "primeng/password";
import {ActivatedRoute} from "@angular/router";
import {MessageData} from '../../utils/helpers';
import {AuthService} from '../../core/services/auth-service';

@Component({
  selector: 'app-reset-password',
    imports: [
        ButtonDirective,
        FormsModule,
        Message,
        Password
    ],
  templateUrl: './reset-password.html',
  styleUrl: '../login/login.scss',
})
export class ResetPassword {
  message = signal<MessageData| null>(null);
  formData = {
    newPassword: '',
    confirmPassword: '',
    token: ''
  }

  constructor(private readonly authService:AuthService,
              private route: ActivatedRoute,) {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.authService.passwordValidate(fragment).subscribe({
          next: result => {
            this.formData.token = fragment;
          },
          error: err => {
            this.message.set({
              type: 'error',
              message: err?.error?.message || 'Алдаа гарлаа. Дахин оролдоно уу.'
            });
          }
        });
      }
    });
  }

  onSubmit() {
    this.authService.passwordReset(this.formData).subscribe({
      next: (result: any) => {
        this.message.set({
          type: 'success',
          message: result?.message
        })
      },
      error: err => {

        this.message.set({
          type: "error",
          message: err?.error?.message || 'Алдаа гарлаа. Дахин оролдоно уу.'
        });

        this.message.set({
          type: "error",
          message: err?.error?.errors[0] || 'Алдаа гарлаа. Дахин оролдоно уу.'
        });
      }
    });
  }
}
