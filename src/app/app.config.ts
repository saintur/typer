import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura'
import {definePreset} from '@primeuix/themes';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#E0F7F9',
      100: '#B3EDF1',
      200: '#80E2E8',
      300: '#4DD6DE',
      400: '#26CBD5',
      500: '#25C6D0',
      600: '#1FB8C1',
      700: '#18A7AE',
      800: '#12979C',
      900: '#0A7C81'
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    providePrimeNG({
      theme: {
        preset: MyPreset
      }
    })
  ]
};
