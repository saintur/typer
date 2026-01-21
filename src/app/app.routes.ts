import { Routes } from '@angular/router';
import {Home} from './pages/home/home';
import {Typing} from './pages/typing/typing';
import {Login} from './pages/login/login';
import {Preferences} from './pages/preferences/preferences';
import {AuthGuard} from './core/auth.guard';
import {ContactUs} from './pages/contact-us/contact-us';
import {Upgrade} from './pages/upgrade/upgrade';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Learn to Type | Free Typing Tutor | Typing Course - Bicheech.mn'
  },
  {
    path: 'typing',
    component: Typing,
    title: 'Learn to Type | Free Typing Tutor | Typing Course - Bicheech.mn'
  },
  {
    path: 'tutor/:lang/:category/:lesson',
    component: Typing,
    title: 'Learn to Type | Free Typing Tutor | Typing Course - Bicheech.mn',
  },
  { path: 'login', component: Login, title: 'Нэвтрэх - Bicheech.mn' },
  { path: 'preferences', component: Preferences, title: 'Тохиргоо - Bicheech.mn', canActivate: [AuthGuard] },
  { path: 'contact-us', component: ContactUs, title: 'Хорбоо Барих - Bicheech.mn' },
  { path: 'upgrade', component: Upgrade, title: 'Шинэчлэх - Bicheech.mn' },
];
