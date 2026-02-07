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
import {Upgrade} from './pages/upgrade/upgrade';
import {Forgot} from './pages/forgot/forgot';
import {ResetPassword} from './pages/reset-password/reset-password';

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
      {path: 'forgot', component: Forgot, title: 'Forgot - Bicheech.mn'},
      {path: 'reset-password', component: ResetPassword, title: 'Password Reset - Bicheech.mn'},
      {path: 'preferences', component: Preferences, title: 'Тохиргоо - Bicheech.mn', canActivate: [AuthGuard], children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },
          {path: 'profile', component: Profile, title: 'Бүртгэл - Bicheech.mn'},
          {path: 'notification', component: Notifications, title: 'Мэдэгдэл - Bicheech.mn'},
          {path: 'password', component: Password, title: 'Нууц үг өөрчлөх - Bicheech.mn'},
          {path: 'membership', component: Membership, title: 'Гишүүнчлэл - Bicheech.mn'},
          {path: 'billing', component: Billing, title: 'Төлбөр - Bicheech.mn'},
          {path: 'options', component: Options, title: 'Тохиргоо - Bicheech.mn'},
        ]},
      {path: 'contact-us', component: ContactUs, title: 'Хорбоо Барих - Bicheech.mn'},
      {path: 'upgrade', component: Upgrade, title: 'Шинэчлэх - Bicheech.mn'},
    ]
  },
  {
    path: 'typing',
    component: Typing,
    title: 'Бичиж сурах | Үнэгүй бичих дасгалжуулагч | Бичих сургалт - Bicheech.mn'
  },

];
