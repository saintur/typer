import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura'
import {definePreset} from '@primeuix/themes';
import {provideQuillConfig} from 'ngx-quill';

const Bicheech = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eef7ff',
      100: '#d8ecff',
      200: '#b9ddff',
      300: '#89c8ff',
      400: '#4aa9ff',
      500: '#007aff',
      600: '#006be0',
      700: '#0059b8',
      800: '#004a94',
      900: '#053f78'
    },
    secondary: {
      50: '#effdfa',
      100: '#ccfbf4',
      200: '#99f6e8',
      300: '#5eead4',
      400: '#30d5c8',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a'
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
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: Bicheech,
        options: {
          darkModeSelector: false,
          cssLayer: {
            name: 'primeng',
            order: 'primeng', // Ensures tailwind base styles come before primeng
          },
        }
      }
    }),
    provideQuillConfig({
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
          [{ 'align': [] }],
          ['link', 'image']                         // link and image, video
        ]
      }
    })
  ]
};
