import { Component } from '@angular/core';
import {Button} from 'primeng/button';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {Card} from 'primeng/card';
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
  invoices: Invoices[] = [
    {
      number: 'INV-1021',
      date: new Date('2025-01-01'),
      amount: 9900,
      status: 'Paid',
      last4: '1234'
    },
    {
      number: 'INV-1019',
      date: new Date('2024-12-01'),
      amount: 9900,
      status: 'Paid',
      last4: '1234'
    }
  ];
  loading: boolean = true;

  constructor(private readonly authService: AuthService, private router: Router) {
    this.authService.getBillings().subscribe({
      complete: (() => {}),
      error: ((err: any) => {}),
      next: ((res: any) => {
        this.invoices = res;
        this.loading = false;
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
