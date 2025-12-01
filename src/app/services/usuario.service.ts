import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

// Interface baseada na imagem enviada
export interface IUsuario {
  id: number;
  created_at?: string;
  updated_at?: string;
  Nome: string;          // Importante: Letra maiúscula conforme imagem
  Email: string;         // Importante: Letra maiúscula conforme imagem
  Telefone: string | null;
  Tipo_acesso: string | null;
  id_administradora?: number | null;
  id_authentication?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private supabase = inject(SupabaseService).client;
  private TABLE = 'Usuarios'; // Nome da tabela conforme imagem

  async getUsuarios(): Promise<IUsuario[]> {
    const { data, error } = await this.supabase
      .from(this.TABLE)
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
    return data || [];
  }
}