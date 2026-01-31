import {Component, OnInit} from '@angular/core';
import {Tag} from 'primeng/tag';
import {Divider} from 'primeng/divider';
import {Button} from 'primeng/button';
import {AuthService} from '../../../core/services/auth-service';
import {Router, RouterLink} from '@angular/router';
import {DatePipe, DecimalPipe} from '@angular/common';
import {Skeleton} from 'primeng/skeleton';
import {UpgradePlan, UserUpgrade} from '../../../utils/helpers';

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
  userUpgrade: UserUpgrade = { active: false, expireAt: null, durationMonth: 0, planName: '' };
  plan: UpgradePlan =  {
    code: 'Free',
    name: 'Үнэгүй',
    durationMonth: 0, // 1 сар
    price: 0, // ⭐ сэтгэл зүйн үнэ
    featured: false,
    conditions: ['Анхан шатны дасгалууд'],
    paymentNote: 'Төлбөргүй'
  };
  loading: boolean = true;

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
      complete: (() => {}),
      next: ((res: any) => {
        this.userUpgrade = res;
      })
    });
    this.loading = false;
  }

  protected change() {
    this.router.navigate(
      ['/membership']
    );
  }
}
