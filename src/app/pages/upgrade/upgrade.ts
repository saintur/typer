import {ChangeDetectorRef, Component, signal} from '@angular/core';
import {Button} from "primeng/button";
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
    Button,
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
      question: 'Төлбөр автоматаар сунгагдах уу?',
      answer: 'Үгүй. Гишүүнчлэлийн төлбөр нэг удаа хийгдэнэ. Хугацаа дууссаны дараа та хүсвэл дахин сунгаж болно.'
    },
    {
      question: 'Нэмэлт хичээлүүдэд юу багтдаг вэ?',
      answer: 'Нэмэлт багцад хуруу тус бүрийн дасгал, тоон бичвэр, мэргэжлийн үг хэллэг болон илүү олон төрлийн дадлага багтана.'
    },
    {
      question: 'Төлбөрөө төлсний дараа хэзээ идэвхжих вэ?',
      answer: 'QPay төлбөр амжилттай баталгаажсаны дараа гишүүнчлэл таны бүртгэл дээр идэвхжинэ.'
    },
    {
      question: 'Би үнэгүй хичээлүүдээ үргэлжлүүлэн ашиглаж болох уу?',
      answer: 'Тийм. Үнэгүй хичээлүүд хэвээр үлдэнэ. Гишүүнчлэл нь нэмэлт хичээл болон илүү өргөн боломжуудыг нээж өгнө.'
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
