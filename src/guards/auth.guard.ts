import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../app/services/supabase.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const supabase = inject(SupabaseService).client;
  const router = inject(Router);

  // Verifica se existe uma sessão ativa
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // Se não houver sessão, manda para o login
    router.navigate(['/']);
    return false;
  }

  // Se houver sessão, permite o acesso
  return true;
};