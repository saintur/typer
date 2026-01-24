import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {providePrimeNG} from 'primeng/config';
import Nora from '@primeuix/themes/nora'
import {definePreset} from '@primeuix/themes';

const Bicheech = definePreset(Nora, {
  semantic: {
    primary: {
      50:  '#e6fffa',
      100: '#b3fff1',
      200: '#80ffe8',
      300: '#33ffda',
      400: '#00ffd1',
      500: '#00cca7',
      600: '#00b392',
      700: '#00997d',
      800: '#008069',
      900: '#006654'
    },
    secondary: {
      50:  '#d6f4f6',
      100: '#ade8ee',
      200: '#6fd7e1',
      300: '#31c6d4',
      400: '#2cb2bf',
      500: '#279eaa',
      600: '#228b94',
      700: '#1d777f',
      800: '#19636a',
      900: '#144f55'
    },
    tertiary: {
      50:  '#ffffcc',
      100: '#ffffb3',
      200: '#ffff80',
      300: '#ffff33',
      400: '#ffff00',
      500: '#e6e600',
      600: '#cccc00',
      700: '#b3b300',
      800: '#999900',
      900: '#808000'
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    providePrimeNG({
      theme: {
        preset: Bicheech,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'primeng', // Ensures tailwind base styles come before primeng
          },
        }
      }
    })
  ]
};
