import 'zone.js/node';
import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

// ✔ Versión sin prerender y con tipado correcto
export default function (context: BootstrapContext) {
  return bootstrapApplication(App, config, context);
}
