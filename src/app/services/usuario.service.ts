import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface IUsuario {
  id: number;
  created_at?: string;
  nome: string;
  email: string;
  telefone: string | null;
  tipo_acesso: string | null;
  id_administradora: number;
  id_authentication?: string | null; 
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private supabase = inject(SupabaseService).client;
  private TABLE = 'usuarios';

  async getUsuarios(): Promise<IUsuario[]> {
    const { data, error } = await this.supabase
      .from(this.TABLE)
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async createUsuario(usuario: Omit<IUsuario, 'id' | 'created_at'>, senhaTemporaria: string) {
    
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email: usuario.email,
      password: senhaTemporaria,
      options: {
        data: { nome: usuario.nome } 
      }
    });

    if (authError) {
      console.error('Erro ao criar Login:', authError);
      throw new Error(`Erro no Auth: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('Usuário criado, mas sem ID retornado.');
    }

    const usuarioParaBanco = {
      ...usuario,
      id_authentication: authData.user.id 
    };

    const { data, error } = await this.supabase
      .from(this.TABLE)
      .insert(usuarioParaBanco)
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar no banco:', error);
      throw error;
    }
    
    return data;
  }
  
  async deleteUsuario(id: number) {
    const { error } = await this.supabase
      .from(this.TABLE)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}