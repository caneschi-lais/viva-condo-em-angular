import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Importe o módulo e os ícones que você usa
import { LucideAngularModule, Building2, Users, LogOut, Plus, Pencil, Trash2 } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Adicione esta linha para registrar os ícones globalmente
    importProvidersFrom(LucideAngularModule.pick({ Building2, Users, LogOut, Plus, Pencil, Trash2 }))
  ]
};