import { Routes } from '@angular/router';
import {Home} from './pages/home/home';
import {Typing} from './pages/typing/typing';
import {Login} from './pages/login/login';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'typing',
    component: Typing
  },
  {
    path: 'login',
    component: Login
  }
];
