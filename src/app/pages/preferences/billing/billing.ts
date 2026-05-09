import {Component, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {Divider} from 'primeng/divider';
import {Router} from '@angular/router';
import {Skeleton} from 'primeng/skeleton';
import {AuthService} from '../../../core/services/auth-service';

export interface Invoices{
  number: string;
  date: Date;
  last4: string;
  amount: number;
  status: string;
}

@Component({
  selector: 'app-billing',
  imports: [
    Button,
    CurrencyPipe,
    DatePipe,
    TableModule,
    Divider,
    Skeleton
  ],
  templateUrl: './billing.html',
  styleUrl: './billing.scss',
})
export class Billing {
  invoices = signal<Invoices[]>([]);
  loading = signal(true);

  constructor(private readonly authService: AuthService, private router: Router) {
    this.authService.getBillings().subscribe({
      next: ((res: any) => {
        this.invoices.set(res);
        this.loading.set(false);
      }),
      error: (() => {
        this.loading.set(false);
      })
    });
  }

  goToOptions() {
    this.router.navigate(
      ['/preferences'],
      { fragment: 'profile' }
    );

  }
}
