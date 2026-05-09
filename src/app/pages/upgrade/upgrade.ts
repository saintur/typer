import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {DecimalPipe} from "@angular/common";
import {Divider} from "primeng/divider";
import {ProgressSpinner} from "primeng/progressspinner";
import {Router} from "@angular/router";
import {Tag} from "primeng/tag";
import {MessageData, UpgradePlan} from '../../utils/helpers';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {AuthService} from '../../core/services/auth-service';
import {ApiService} from '../../core/services/api-service';
import {NgxNeonUnderlineComponent} from '@omnedia/ngx-neon-underline';
import {NgxParticlesComponent} from '@omnedia/ngx-particles';
import {NgxShineBorderComponent} from '@omnedia/ngx-shine-border';
import {NgxHaloComponent} from '@omnedia/ngx-halo';

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
    Button,
    DecimalPipe,
    Divider,
    ProgressSpinner,
    Tag,
    NgxNeonUnderlineComponent,
    NgxParticlesComponent,
    NgxShineBorderComponent,
    NgxHaloComponent
  ],
  templateUrl: './upgrade.html',
  styleUrl: './upgrade.scss',
})
export class Upgrade implements OnInit {
  message!: MessageData;
  authenticated = false;
  showPayInfo = false;
  current = 'Free';

  hovering: string|null = null;

  upgradeData: UpgradePlan[] = [
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
    private ref: ChangeDetectorRef,
    private readonly authService: AuthService,
    private readonly apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.authenticated = this.authService.isLoggedIn();
    this.apiService.getUpgradePlans().subscribe(response => {
      this.upgradeData = response;
      this.ref.detectChanges();
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
