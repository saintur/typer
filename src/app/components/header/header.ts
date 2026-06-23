import {Component, OnInit, Signal} from '@angular/core';
import {Button} from "primeng/button";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from '../../core/services/auth-service';
import {User} from '../../utils/helpers';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {Popover} from 'primeng/popover';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  imports: [
    Button,
    RouterLink,
    AsyncPipe,
    Popover,
    RouterLinkActive,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  user$!: Observable<User | null>;
  isPrime!: Signal<boolean>;

  constructor(private readonly router: Router,
              private readonly authService: AuthService,) {
    this.isPrime = toSignal(this.authService.isPremium$(), { initialValue: false });
  }

  ngOnInit(): void {
    this.user$ = this.authService.$User;
  }

  logout(op: Popover, event: Event) {
    event.stopPropagation();
    op.hide();
    this.authService.logout();
    this.router.navigate(["/login"]).then()
  }

  protected navigate(op: Popover, s: string, event: Event) {
    event.stopPropagation();
    op.hide();
    this.router.navigate([s]).then()
  }
}
