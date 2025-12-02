import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CondominiosComponent } from './pages/condominios/condominios.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { authGuard } from '../guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    component: LoginComponent 
  },
  { 
    path: 'condominios', 
    component: CondominiosComponent,
    canActivate: [authGuard] // Adicione esta linha
  },
  { 
    path: 'usuarios', 
    component: UsuariosComponent,
    canActivate: [authGuard] // Adicione esta linha
  },
];