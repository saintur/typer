import {Component} from '@angular/core';
import {ButtonDirective, ButtonLabel} from "primeng/button";
import {Header} from "../../components/header/header";
import {IftaLabel} from 'primeng/iftalabel';
import {FormsModule} from '@angular/forms';
import {form} from '@angular/forms/signals';
import {InputText} from 'primeng/inputtext';
import {Password} from 'primeng/password';

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
  protected readonly form = form;

}
