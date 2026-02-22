import {Component, signal} from '@angular/core';
import {ButtonDirective, ButtonLabel} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {Message} from "primeng/message";
import {Password} from "primeng/password";
import {AuthService} from '../../core/services/auth-service';
import {Router, RouterLink} from '@angular/router';
import {concatMap, first} from 'rxjs';
import {MessageData} from '../../utils/helpers';

@Component({
  selector: 'app-register',
  imports: [
    ButtonDirective,
    ButtonLabel,
    FormsModule,
    InputText,
    Message,
    Password,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: '../login/login.scss',
})
export class Register {

  message = signal<MessageData|null>(null);
  formData = {
    username: '',
    email: '',
    password: ''
  }
  constructor(private readonly authService:AuthService,
              private router: Router,) {
  }

  onSubmit() {
    this.authService.signUp(this.formData)
      .pipe(
        first(),
        concatMap(async () => this.authService.fetchUserData().subscribe({
          next: value => {}
        }))
      )
      .subscribe({
        next: (data: any) => {
          // get return url from route parameters or default to '/'
          this.message.set({ type: 'success', message: data.message });
        },
        error: (err) => {
          let message = 'Something went wrong';

          if (err?.error?.status === 'CONFLICT') {
            message = err.error.message;
          }

          else if (err?.error?.status === 'INTERNAL_SERVER_ERROR') {
            message = err.error.message || err.message;
          }

          else if (err?.error?.status === 'BAD_REQUEST') {
            if (Array.isArray(err.error.errors)) {
              message = err.error.errors.join(', ');
            } else {
              message = err.error.message;
            }
          }

          this.message.set({
            type: 'error',
            message
          });
        }
      });
  }
}
