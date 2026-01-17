import { Routes } from '@angular/router';
import {Home} from './pages/home/home';
import {Typing} from './pages/typing/typing';
import {Login} from './pages/login/login';

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
  {
    path: 'login',
    component: Login,
    title: 'Нэвтрэх - Bicheech.mn',
  }
];
