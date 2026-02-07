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
    RouterLink
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
}
