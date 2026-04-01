import { Component } from '@angular/core';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from "primeng/accordion";
import {Button} from "primeng/button";
import {Card} from "primeng/card";
import {DecimalPipe} from "@angular/common";
import {Divider} from "primeng/divider";
import {ProgressSpinner} from "primeng/progressspinner";
import {Router, RouterLink} from "@angular/router";
import {Tag} from "primeng/tag";
import {MessageData, UpgradePlan} from '../../utils/helpers';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {AuthService} from '../../core/services/auth-service';
import {ApiService} from '../../core/services/api-service';

interface InvoiceItem {
  number: string,
  amount: number,
  currency: string,
  status: string,
  last4: string,
  date: Date,
  qrText: string,
  qrImage: string,
  shortUrl: string,
  urls: string
}

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
    ProgressSpinner,
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
      id: 1,
      code: 'Free',
      name: 'Үнэгүй',
      durationMonth: 0, // 1 сар
      price: 0, // ⭐ сэтгэл зүйн үнэ
      featured: false,
      conditions: ['Анхан шатны дасгалууд'],
      paymentNote: 'Төлбөргүй'
    },
    {
      id: 2,
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
      id: 3,
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
  selectedPlan: (UpgradePlan & { qrText: string; qrImage: string; shortUrl: string }) | null = null;
  qrLoading = false;
  qrError = false;

  upgradeForm = new FormGroup({
    planId: new FormControl<number|null>(null),
  });
  protected isPremium$: Observable<boolean> = of(false);

  constructor(
    private router: Router,
    private readonly authService: AuthService,
    private readonly apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.authenticated = this.authService.isLoggedIn();
    this.apiService.getUpgradePlans().subscribe(response => {
      this.upgradeData = response;
    });
  }

  protected choose(plan: UpgradePlan) {
    if (plan.price === 0) return;
    this.selectedPlan = { ...plan, qrText: '', qrImage: '', shortUrl: '' };
    this.qrLoading = true;
    this.qrError = false;

    this.upgradeForm.patchValue({ planId: plan.id });

    if (this.upgradeForm.invalid) {
      this.qrLoading = false;
      return;
    }

    this.apiService.purchase(this.upgradeForm.value).subscribe({
      next: (res: any) => {
        if (this.selectedPlan) {
          this.selectedPlan.qrText = res.qrText;
          this.selectedPlan.qrImage = res.qrImage;
          this.selectedPlan.shortUrl = res.shortUrl;
        }
        this.qrLoading = false;
      },
      error: ((err: any) => {
        this.qrLoading = false;
        this.qrError = true;
        this.message = {
          type: 'error',
          message: 'Өгөгдөлийг хадгалахад алдаа гарлаа'
        };
      })
    });
  }
}
