import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Message} from 'primeng/message';
import {Button} from 'primeng/button';
import {Select} from 'primeng/select';
import {Card} from 'primeng/card';
import {Divider} from 'primeng/divider';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {AuthService} from '../../../core/services/auth-service';
import {Observable} from 'rxjs';
import {MessageData, User} from '../../../utils/helpers';
import {toObservable} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-options',
  imports: [
    Message,
    Button,
    ReactiveFormsModule,
    Select,
    Card,
    Divider,
    ToggleSwitch
  ],
  templateUrl: './options.html',
  styleUrl: './options.scss',
})
export class Options {
  user$!: Observable<User | null>;
  message!: MessageData;
  loading: boolean = false;
  measureSpeedData = [ { label: 'WPM', value: 'WPM' },
    { label: 'KPM', value: 'KPM' },
  ];
  optionsForm: FormGroup = new FormGroup({
    measureSpeed: new FormControl(
      "",
      {
        validators: [
          Validators.required
        ]}),
    enableSounds: new FormControl(
      "",
      {
        validators: [
          Validators.required
        ]})
  });

  constructor(private readonly authService: AuthService,) {
    this.user$ = this.authService.$User;
    this.user$.subscribe((user : User|null) => {
      this.optionsForm.patchValue({
        measureSpeed: user?.measureSpeed,
        enableSounds: user?.enableSounds,
      });
    });
  }

  optionsSubmit() {
    this.loading = true;
    this.authService.changeOptions(this.optionsForm.value).subscribe({
      complete: (() => {

      }),
      error: ((err: any) => {
          this.message = {
            type: 'error',
            message: 'Өгөгдөлийг хадгалахад алдаа гарлаа'
          };
      }),
      next: ((res: any) => {
        this.message = {
          type: 'success',
          message: res['message']
        };
      })
    });

    this.loading = false;

  }
}
