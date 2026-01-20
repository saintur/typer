import {Component, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from '../../core/services/auth-service';
import {User} from '../../utils/helpers';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    Button,
    RouterLink,
    AsyncPipe
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

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]).then()

  }
}
