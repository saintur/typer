import {Component} from '@angular/core';
import {ButtonDirective, ButtonLabel} from "primeng/button";
import {Header} from "../../components/header/header";
import {IftaLabel} from 'primeng/iftalabel';
import {FormsModule} from '@angular/forms';
import {form} from '@angular/forms/signals';
import {InputText} from 'primeng/inputtext';
import {Password} from 'primeng/password';
import {inject} from 'vitest';
import {AuthService} from '../../core/services/auth-service';
import {first} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    Header,
    IftaLabel,
    FormsModule,
    InputText,
    Password,
    ButtonDirective,
    ButtonLabel
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  formData = {
    username: '',
    password: ''
  }
  constructor(private readonly authService:AuthService,
              private router: Router,) {
    // user name: sainaa3
    // pass: Bicheech@A9
  }
  protected readonly form = form;

  onSubmit() {
    this.authService.login(this.formData)
      .pipe(first())
      .subscribe({
        next: () => {
          // get return url from route parameters or default to '/'
          this.router.navigateByUrl('/');
        },
        error: error => {
          //this.error = error;
          //this.loading = false;
        }
      });
  }
}
