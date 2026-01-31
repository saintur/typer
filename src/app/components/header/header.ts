import {Component, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from '../../core/services/auth-service';
import {User} from '../../utils/helpers';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {Popover} from 'primeng/popover';
import {Menu} from 'primeng/menu';

@Component({
  selector: 'app-header',
  imports: [
    Button,
    RouterLink,
    AsyncPipe,
    Popover,
    Menu
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  user$!: Observable<User | null>;
  authenticated: boolean = false;
  constructor(private readonly router: Router,
              private readonly authService: AuthService,) {
  }

  ngOnInit(): void {
    this.authenticated = this.authService.isLoggedIn();
    this.user$ = this.authService.$User;
  }

  logout(op: Popover) {
    op.hide();
    this.authService.logout();
    this.router.navigate(["/login"]).then()

  }

  protected navigate(op: Popover, s: string) {
    op.hide();
    this.router.navigate([s]).then()
  }
}
