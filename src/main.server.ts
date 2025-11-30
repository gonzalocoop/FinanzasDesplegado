// main.server.ts
import 'zone.js/node';
import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config as originalConfig } from './app/app.config.server';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';

// Creamos una copia de la configuración original y agregamos NoopAnimationsModule
const config = {
  ...originalConfig,
  providers: [
    ...(originalConfig.providers || []),
    importProvidersFrom(NoopAnimationsModule), // <-- evita cargar @angular/animations/browser en SSR
  ]
};

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(App, config, context);

export default bootstrap;
