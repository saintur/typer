import {Component, signal} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {Message} from "primeng/message";
import {MessageData} from '../../utils/helpers';
import {AuthService} from '../../core/services/auth-service';

@Component({
  selector: 'app-forgot',
  imports: [
    ButtonDirective,
    FormsModule,
    InputText,
    Message,
  ],
  templateUrl: './forgot.html',
  styleUrl: '../login/login.scss',
})
export class Forgot {
  message = signal<MessageData| null>(null);
  formData = {
    email: '',
  }
  forgotLoading: boolean = false;

  constructor(private readonly authService:AuthService) {
  }

  sendResetEmail() {
    this.forgotLoading = true;

    // fake validation example
    if (!this.formData.email || !this.formData.email.includes('@')) {
      this.forgotLoading = false;
      return;
    }

    this.authService.sendResetEmail(this.formData.email).subscribe({
      next: () => {
        this.formData.email = '';

        this.message.set({
          type: 'success',
          message: 'Нууц үг солих заавар таны и-мэйл хаяг руу амжилттай илгээгдлээ.'
        });
        this.forgotLoading = false;
      },
      error: (err) => {
        this.message.set({
          type: 'error',
          message: err?.error?.message || 'Алдаа гарлаа. Дахин оролдоно уу.'
        });
        this.forgotLoading = false;
      }
    });
  }
}
