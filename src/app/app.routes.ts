import {Routes} from '@angular/router';
import {Home} from './pages/home/home';
import {Typing} from './pages/typing/typing';
import {Login} from './pages/login/login';
import {Preferences} from './pages/preferences/preferences';
import {AuthGuard} from './core/auth.guard';
import {ContactUs} from './pages/contact-us/contact-us';
import {Membership} from './pages/preferences/membership/membership';
import {Layout} from './components/layout/layout';
import {Register} from './pages/register/register';
import {Profile} from './pages/preferences/profile/profile';
import {Notifications} from './pages/preferences/notifications/notifications';
import {Password} from './pages/preferences/password/password';
import {Options} from './pages/preferences/options/options';
import {Billing} from './pages/preferences/billing/billing';

export const routes: Routes = [
  {
    path: '', component: Layout, children: [
      { path: '', redirectTo: '', pathMatch: 'full' },
      {
        path: '',
        component: Home,
        title: 'Бичиж сурах | Үнэгүй бичих дасгалжуулагч | Бичих сургалт - Bicheech.mn'
      },
      {path: 'login', component: Login, title: 'Нэвтрэх - Bicheech.mn'},
      {path: 'register', component: Register, title: 'Бүртгүүлэх - Bicheech.mn'},
      {path: 'preferences', component: Preferences, title: 'Тохиргоо - Bicheech.mn', canActivate: [AuthGuard], children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },
          {path: 'profile', component: Profile, title: 'Нэвтрэх - Bicheech.mn'},
          {path: 'notification', component: Notifications, title: 'Бүртгүүлэх - Bicheech.mn'},
          {path: 'password', component: Password, title: 'Бүртгүүлэх - Bicheech.mn'},
          {path: 'membership', component: Membership, title: 'Бүртгүүлэх - Bicheech.mn'},
          {path: 'billing', component: Billing, title: 'Бүртгүүлэх - Bicheech.mn'},
          {path: 'options', component: Options, title: 'Бүртгүүлэх - Bicheech.mn'},
        ]},
      {path: 'contact-us', component: ContactUs, title: 'Хорбоо Барих - Bicheech.mn'},
      {path: 'membership', component: Membership, title: 'Шинэчлэх - Bicheech.mn'},
    ]
  },
  {
    path: 'typing',
    component: Typing,
    title: 'Бичиж сурах | Үнэгүй бичих дасгалжуулагч | Бичих сургалт - Bicheech.mn'
  },

];
