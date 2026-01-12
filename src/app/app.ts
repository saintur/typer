import {Component, signal} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {TypingLayout} from './components/typing-layout/typing-layout';
import {AuthService, User} from './core/services/auth-service';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TypingLayout, RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  isAuthenticated: boolean = false;
  user$!: Observable<User | null>;

  constructor(private readonly authService: AuthService,
              private readonly router: Router,) {
    this.isAuthenticated = this.authService.isLoggedIn();
    this.user$ = this.authService.$User;
  }

  logout() {

    this.authService.logout();
    this.router.navigate(["/login"]).then()

  }
}
