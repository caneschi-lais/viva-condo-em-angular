import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CondominiosComponent } from './pages/condominios/condominios.component';
// import { UsuariosComponent } from './pages/usuarios/usuarios.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'condominios', component: CondominiosComponent },
  // { path: 'usuarios', component: UsuariosComponent },
];