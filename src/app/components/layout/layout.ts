import { Component } from '@angular/core';
import {Header} from "../header/header";
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {Footer} from '../footer/footer';

@Component({
  selector: 'app-layout',
  imports: [
    Header,
    RouterOutlet,
    Footer
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  page = ''

  constructor(private router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.page = router.url.split('/')[1];
      }
    })
  }
}
