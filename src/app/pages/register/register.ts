import {Component, signal} from '@angular/core';
import {ButtonDirective, ButtonLabel} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {Message} from "primeng/message";
import {Password} from "primeng/password";
import {AuthService} from '../../core/services/auth-service';
import {Router, RouterLink} from '@angular/router';
import {concatMap, first} from 'rxjs';

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
  styleUrl: './register.scss',
})
export class Register {

  error_message = signal<String>('');
  formData = {
    username: '',
    email: '',
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

  }
}
