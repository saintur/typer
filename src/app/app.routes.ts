import { Routes } from '@angular/router';
import {ContactUs} from './pages/contact-us/contact-us';
import {Composer} from './components/composer/composer';

export const routes: Routes = [
  //public
  // { path: 'login', component: Signin },
  // { path: 'login', component: Signup },

  { path: '', redirectTo: '/tutor', pathMatch: 'full' },
  { path: 'tutor', component: Composer },

  // { path: 'upgrade', component: Upgrade, title: 'Шинэчлэх - Bicheech.mn' },
  // { path: 'hall-of-fame', component: HallOfFame, title: 'Алдрын Танхим - Bicheech.mn' },
  { path: 'contact-us', component: ContactUs, title: 'Хорбоо Барих - Bicheech.mn' }
];
