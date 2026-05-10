import {ChangeDetectorRef, Component, signal} from '@angular/core';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from "primeng/accordion";
import {Button} from "primeng/button";
import {Card} from "primeng/card";
import {DecimalPipe} from "@angular/common";
import {Divider} from "primeng/divider";
import {ProgressSpinner} from "primeng/progressspinner";
import {Router} from "@angular/router";
import {Tag} from "primeng/tag";
import {MembershipPlan, MessageData} from '../../utils/helpers';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {AuthService} from '../../core/services/auth-service';
import {ApiService} from '../../core/services/api-service';
import {NgxNeonUnderlineComponent} from '@omnedia/ngx-neon-underline';
import {NgxParticlesComponent} from '@omnedia/ngx-particles';

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
    Tag,
    NgxNeonUnderlineComponent,
    NgxParticlesComponent
  ],
  templateUrl: './upgrade.html',
  styleUrl: './upgrade.scss',
})
export class Upgrade {
  message!: MessageData;
  authenticated = false;
  showPayInfo = false;
  current = 'Free';

  upgradeData = signal<MembershipPlan[]>([]);

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

  currUpgrade!: MembershipPlan;
  selectedPlan = signal<(MembershipPlan & { qrText: string; qrImage: string; shortUrl: string }) | null>(null);
  qrLoading = signal(false);
  qrError = signal(false);

  upgradeForm = new FormGroup({
    planId: new FormControl<number | null>(null),
  });
  protected isPremium$: Observable<boolean> = of(false);

  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private readonly authService: AuthService,
    private readonly apiService: ApiService,
  ) {
  }

  ngOnInit(): void {
    this.authenticated = this.authService.isLoggedIn();
    this.apiService.getMembershipPlans().subscribe((response: MembershipPlan[]) => {
      this.upgradeData.set(response as MembershipPlan[]);
      this.ref.detectChanges();
      console.log(this.upgradeData);
    });
  }

  protected choose(plan: MembershipPlan) {
    if (plan.price === 0) return;
    this.selectedPlan.set({...plan, qrText: '', qrImage: '', shortUrl: ''});
    this.qrLoading.set(true);
    this.qrError.set(false);

    this.upgradeForm.patchValue({planId: plan.id});

    if (this.upgradeForm.invalid) {
      this.qrLoading.set(false);
      return;
    }

    this.apiService.purchase(this.upgradeForm.value).subscribe({
      next: (res: any) => {
        this.selectedPlan.update(p => p ? {
          ...p,
          qrText: res.qrText,
          qrImage: res.qrImage,
          shortUrl: res.shortUrl
        } : null);
        this.qrLoading.set(false);
      },
      error: ((err: any) => {
        this.qrLoading.set(false);
        this.qrError.set(true);
        this.message = {
          type: 'error',
          message: 'Өгөгдөлийг хадгалахад алдаа гарлаа'
        };
      })
    });
  }
}
