import {Component, signal} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {first, of} from 'rxjs';

import {Header} from "../../components/header/header";
import {AuthService} from '../../core/services/auth-service';

import {ButtonDirective, ButtonLabel} from "primeng/button";
import {IftaLabel} from 'primeng/iftalabel';
import {InputText} from 'primeng/inputtext';
import {Password} from 'primeng/password';
import {Message} from 'primeng/message';

@Component({
  selector: 'app-login',
  imports: [
    Header,
    IftaLabel,
    FormsModule,
    InputText,
    Password,
    ButtonDirective,
    ButtonLabel,
    Message
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  error_message = signal<String>('');
  formData = {
    username: '',
    password: ''
  }
  constructor(private readonly authService:AuthService,
              private router: Router,) {
    // user name: sainaa3
    // pass: Bicheech@A9
  }

  getErrorMessage() {
    return this.error_message;
  }

  onSubmit() {
    this.authService.login(this.formData)
      .pipe(first())
      .subscribe({
        next: () => {
          // get return url from route parameters or default to '/'
          this.authService.fetchUserData();
          this.error_message.set('');
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.error_message.set(err?.error?.message ?? 'Нэвтрэх нэр эсвэл нууц үг буруу байна');
        }
      });
  }
}
