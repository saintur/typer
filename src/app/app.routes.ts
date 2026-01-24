import { Routes } from '@angular/router';
import {Home} from './pages/home/home';
import {Typing} from './pages/typing/typing';
import {Login} from './pages/login/login';
import {Preferences} from './pages/preferences/preferences';
import {AuthGuard} from './core/auth.guard';
import {ContactUs} from './pages/contact-us/contact-us';
import {Membership} from './pages/membership/membership';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Бичиж сурах | Үнэгүй бичих дасгалжуулагч | Бичих сургалт - Bicheech.mn'
  },
  {
    path: 'tutor',
    component: Home,
    title: 'Бичиж сурах | Үнэгүй бичих дасгалжуулагч | Бичих сургалт - Bicheech.mn'
  },
  {
    path: 'tutor/:lang',
    component: Home,
    title: 'Бичиж сурах | Үнэгүй бичих дасгалжуулагч | Бичих сургалт - Bicheech.mn'
  },
  {
    path: 'typing',
    component: Typing,
    title: 'Бичиж сурах | Үнэгүй бичих дасгалжуулагч | Бичих сургалт - Bicheech.mn'
  },
  {
    path: 'tutor/:lang/:category/:lesson',
    component: Typing,
    title: 'Бичиж сурах | Үнэгүй бичих дасгалжуулагч | Бичих сургалт - Bicheech.mn',
  },
  { path: 'login', component: Login, title: 'Нэвтрэх - Bicheech.mn' },
  { path: 'preferences', component: Preferences, title: 'Тохиргоо - Bicheech.mn', canActivate: [AuthGuard] },
  { path: 'contact-us', component: ContactUs, title: 'Хорбоо Барих - Bicheech.mn' },
  { path: 'membership', component: Membership, title: 'Шинэчлэх - Bicheech.mn' },
];
