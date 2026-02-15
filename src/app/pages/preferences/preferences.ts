import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AuthService} from '../../core/services/auth-service';

@Component({
  selector: 'app-preferences',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './preferences.html',
  styleUrl: './preferences.scss',
})
export class Preferences implements OnInit {
  activeTab = 'membership';
  constructor(private route: ActivatedRoute,
              private readonly router: Router,
              private readonly authService: AuthService,) {}

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.activeTab = fragment;
      }
    });
  }

  onTabChange() {
    this.router.navigate([], {
      replaceUrl: true
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]).then()
  }
}
