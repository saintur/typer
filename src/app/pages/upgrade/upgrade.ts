import { Component } from '@angular/core';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from "primeng/accordion";
import {Button} from "primeng/button";
import {Card} from "primeng/card";
import {DecimalPipe} from "@angular/common";
import {Divider} from "primeng/divider";
import {Router, RouterLink} from "@angular/router";
import {Tag} from "primeng/tag";
import {MessageData, UpgradePlan} from '../../utils/helpers';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {AuthService} from '../../core/services/auth-service';
import {ApiService} from '../../core/services/api-service';

@Component({
  selector: 'app-upgrade',
  imports: [
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    Button,
    Card,
    DecimalPipe,
    Divider,
    RouterLink,
    Tag
  ],
  templateUrl: './upgrade.html',
  styleUrl: './upgrade.scss',
})
export class Upgrade {
  message!: MessageData;
  authenticated = false;
  showPayInfo = false;
  current = 'Free';

  upgradeData: UpgradePlan[] = [
    {
      code: 'Free',
      name: 'Үнэгүй',
      durationMonth: 0, // 1 сар
      price: 0, // ⭐ сэтгэл зүйн үнэ
      featured: false,
      conditions: ['Анхан шатны дасгалууд'],
      paymentNote: 'Төлбөргүй'
    },
    {
      code: 'Monthly',
      name: 'Сараар',
      durationMonth: 1, // 1 сар
      price: 9900, // ⭐ сэтгэл зүйн үнэ
      featured: false,
      conditions: ['Бүх Нэмэлт хичээл',
        'Давуу эрхтэй и-мэйл дэмжлэг',
        'Зар сурталчилгааг арилгах' ],
      paymentNote: '1 сарын хугацаатай, нэг удаагийн төлбөр. Хүсвэл дараа нь сунгана.'
    },
    {
      code: 'Yearly',
      name: 'Жилээр',
      durationMonth: 12, // 1 жил
      price: 29900, // ⭐ BEST VALUE
      featured: false,
      conditions: ['Бүх Нэмэлт хичээл',
        'Давуу эрхтэй и-мэйл дэмжлэг',
        'Зар сурталчилгааг арилгах' ],
      paymentNote: '1 жилийн хугацаатай, нэг удаагийн төлбөр. Хугацаа дууссаны дараа сунгана.'
    },
  ];

  questions = [
    {
      question: 'Are Yearly Charges Auto-Recurring?',
      answer: 'No, charges are never auto-recurring. For yearly membership types, we will only charge you once. When your membership expires you can optionally choose to renew.'
    },
    {
      question: 'What are Premium Lessons?',
      answer: 'Recommended for anyone truly interested in getting the most out of Bicheech, we offer 16 extra premium lessons including individual finger exercises, common medical terms, numeric data entry, as well as fun and interesting facts to keep your learning time fresh and fun.'
    },
    {
      question: 'What is Priority Email Support?',
      answer: 'Have a question about your account, or about getting the most out of Bicheech? Premium members are guaranteed a fast response from our team of experts.'
    }
  ];


  currUpgrade!: UpgradePlan;

  upgradeForm = new FormGroup({
    planId: new FormControl<string>(''),
  });
  protected isPremium$: Observable<boolean> = of(false);

  constructor(
    private router: Router,
    private readonly authService: AuthService,
    private readonly apiService: ApiService,
  ) {}

  ngOnInit(): void {
    // this.authenticated = this.authService.isLoggedIn();
    // this.apiService.getUpgradePlans().subscribe(response => {
    //   this.upgradeData = response;
    // });
  }

  getConditionTerm(plan: UpgradePlan): string {
    return plan.durationMonth !== 99
      ? `${plan.durationMonth} Month`
      : 'Lifetime';
  }

  setCurrUpgrade(plan: UpgradePlan): void {
    this.currUpgrade = plan;
    this.showPayInfo = true;

    this.upgradeForm.patchValue({
      planId: plan.code,
    });
  }

  onSubmit(): void {
    if (this.upgradeForm.invalid) {
      return;
    }

    this.apiService.purchase(this.upgradeForm.value).subscribe({
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

    // TODO:
    // 1. Payment API дуудах
    // 2. Gateway redirect
    // 3. Backend verify
  }

  protected choose() {

  }
}
