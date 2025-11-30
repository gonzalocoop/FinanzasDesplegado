// src/main.ts (Finanzas - Corregido)

import 'zone.js'; // <-- ¡AÑADE ESTA LÍNEA AL INICIO DE TODO!

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));