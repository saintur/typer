import { Component } from '@angular/core';
import {Card} from 'primeng/card';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs';
import {Profile} from './profile/profile';
import {Password} from './password/password';
import {Membership} from './membership/membership';
import {Notifications} from './notifications/notifications';
import {Billing} from './billing/billing';
import {Options} from './options/options';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-preferences',
  imports: [
    Card,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Profile,
    Password,
    Membership,
    Notifications,
    Billing,
    Options,
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
