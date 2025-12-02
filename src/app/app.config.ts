import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { LucideAngularModule, Building2, Users, LogOut, Plus, Pencil, Trash2 } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
     importProvidersFrom(LucideAngularModule.pick({ Building2, Users, LogOut, Plus, Pencil, Trash2 }))
  ]
};