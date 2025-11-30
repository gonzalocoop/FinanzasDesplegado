import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');
const app = express();
const angularApp = new AngularNodeAppEngine();

// Servir archivos estáticos
app.use(express.static(browserDistFolder, { maxAge: '1y', index: false, redirect: false }));

// Usar request handler de Angular SSR SIN prerendering
export const reqHandler = createNodeRequestHandler(app);

// Iniciar servidor solo si es main
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => console.log(`Node Express server listening on http://localhost:${port}`));
}
