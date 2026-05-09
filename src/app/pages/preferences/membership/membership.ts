import {Component, OnInit, signal} from '@angular/core';
import {Tag} from 'primeng/tag';
import {Divider} from 'primeng/divider';
import {Button} from 'primeng/button';
import {AuthService} from '../../../core/services/auth-service';
import {Router, RouterLink} from '@angular/router';
import {DatePipe, DecimalPipe} from '@angular/common';
import {Skeleton} from 'primeng/skeleton';
import {MembershipPlan, UserUpgrade} from '../../../utils/helpers';

@Component({
  selector: 'app-membership',
  imports: [
    Tag,
    Divider,
    Button,
    DatePipe,
    Skeleton,
    RouterLink,
    DecimalPipe
  ],
  templateUrl: './membership.html',
  styleUrl: './membership.scss',
})
export class Membership implements OnInit {
  userUpgrade = signal<UserUpgrade>({ active: false, expireAt: null, durationMonth: 0, planName: '' });
  plan: MembershipPlan =  {
    code: 'Free',
    name: 'Үнэгүй',
    durationMonth: 0, // 1 сар
    price: 0, // ⭐ сэтгэл зүйн үнэ
    featured: false,
    conditions: [{ id: 1, conditionText: 'Анхан шатны дасгалууд'}],
    paymentNote: 'Төлбөргүй'
  };
  loading = signal(true);

  constructor(private readonly authService: AuthService,
              private readonly router: Router,) {
  }

  goToBilling() {
    this.router.navigate(
      ['/preferences'],
      { fragment: 'billing' }
    );
  }

  ngOnInit(): void {
    this.authService.getMembership().subscribe({
      next: ((res: any) => {
        this.userUpgrade.set(res);
        this.loading.set(false);
      }),
      error: (() => {
        this.loading.set(false);
      })
    });
    this.loading.set(false);
  }

  protected change() {
    this.router.navigate(
      ['/membership']
    );
  }
}
