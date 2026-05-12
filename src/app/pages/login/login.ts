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

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    InputText,
    Password,
    ButtonDirective,
    ButtonLabel,
    Message,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loading = false;
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

  onSubmit(event: Event) {
    event.preventDefault();
    this.loading = true;
    this.message.set(null);
    this.authService.login(this.formData)
      .pipe(
        first(),
        concatMap(() => this.authService.fetchUserData())
      )
      .subscribe({
        next: () => {
          // get return url from route parameters or default to '/'
          this.loading = false;
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.message.set( {
            type: 'error',
            message: 'Нэвтрэх нэр эсвэл нууц үг буруу байна'
          });
          this.loading = false;
        }
      });
  }
}
