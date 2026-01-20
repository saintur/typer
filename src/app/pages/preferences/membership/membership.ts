import {Component, OnInit} from '@angular/core';
import {Tag} from 'primeng/tag';
import {Divider} from 'primeng/divider';
import {Button} from 'primeng/button';
import {AuthService} from '../../../core/services/auth-service';
import {Router, RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {Skeleton} from 'primeng/skeleton';
import {UserUpgrade} from '../../../utils/helpers';

@Component({
  selector: 'app-membership',
  imports: [
    Tag,
    Divider,
    Button,
    DatePipe,
    Skeleton,
    RouterLink
  ],
  templateUrl: './membership.html',
  styleUrl: './membership.css',
})
export class Membership implements OnInit {
  userUpgrade: UserUpgrade = { active: false, expireAt: null, durationMonth: 0, planName: '' };
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
}
