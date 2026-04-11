import {Component, signal} from '@angular/core';
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
  message = signal<MessageData | null>(null);
  settings = signal<any>({
    all: true,
    learning: true,
    social: true,
    news: false,
  });

  constructor(private readonly authService: AuthService,) {
    this.authService.fetchNotifications().subscribe({
      next: (data: any) => {
        this.settings.set(data);
      }
    });
  }

  toggleAll() {
    this.settings.update(s => {
      const updated = { ...s };
      Object.keys(updated).forEach(key => {
        if (key !== 'all') updated[key] = updated.all;
      });
      return updated;
    });
    this.save();
  }

  save() {
    this.authService.changeNotifications(this.settings()).subscribe({
      error: ((err: any) => {
        this.message.set({ type: 'error', message: 'Өгөгдөлийг хадгалахад алдаа гарлаа' });
      }),
      next: ((res: any) => {
        this.message.set({ type: 'success', message: res['message'] });
      })
    });
  }
}
