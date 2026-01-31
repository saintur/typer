import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ToggleSwitch} from 'primeng/toggleswitch';
import {Message} from 'primeng/message';
import {Divider} from 'primeng/divider';

import {AuthService} from '../../../core/services/auth-service';
import {MessageData} from '../../../utils/helpers';

@Component({
  selector: 'app-notifications',
  imports: [
    ToggleSwitch,
    ReactiveFormsModule,
    FormsModule,
    Message,
    Divider
  ],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications {
  message!: MessageData;
  loading: boolean = false;
  settings: any = {
    all: true,
    learning: true,
    social: true,
    news: false,
  };

  constructor(private readonly authService: AuthService,) {
    this.authService.fetchNotifications().subscribe({
      next: (data: any) => {
        this.settings = data
      }
    });
  }

  toggleAll() {
    Object.keys(this.settings).forEach(key => {
      if (key !== 'all') {
        this.settings[key] = this.settings.all;
      }
    });
    this.save();
  }

  save() {
    this.authService.changeNotifications(this.settings).subscribe({
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
  }
}
