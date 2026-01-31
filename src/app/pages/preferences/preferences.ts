import {Component} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

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
export class Preferences {
  activeTab = 'membership';
  constructor(private route: ActivatedRoute,
              private readonly router: Router,) {}

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
}
