import { Component } from '@angular/core';
import {Observable, of} from 'rxjs';
import {AuthService} from '../../core/services/auth-service';
import {AsyncPipe} from '@angular/common';
import {WallOfFame} from '../../utils/utils';
import {Skeleton} from 'primeng/skeleton';
import {ApiService} from '../../core/services/api-service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-typing-layout',
  imports: [
    Skeleton,
    RouterLink
  ],
  templateUrl: './typing-layout.html',
  styleUrl: './typing-layout.scss',
})
export class TypingLayout {
  isAuthenticated: boolean = false;
  protected isPremium$: Observable<boolean> = of(false);
  wallOfFame!: WallOfFame;
  level!: any;

  loadingWallOfFame = true;
  loadingLevel = true;

  constructor(private readonly authService: AuthService,
              private readonly apiService: ApiService,) {
    //this.isPremium$ = this.authService.isPremium$();
    this.isAuthenticated = this.authService.isLoggedIn();

    this.apiService.getWallOfFame().subscribe(res => {
      this.wallOfFame = res;
      this.loadingWallOfFame = false;
    });

    this.apiService.getLevel().subscribe(res => {
      this.level = res;
      this.loadingLevel = false;
    });

    this.wallOfFame = {username: 'Sainaa13', wpm: '31', accuracy: '99'}
    this.loadingWallOfFame = false;
  }

}
