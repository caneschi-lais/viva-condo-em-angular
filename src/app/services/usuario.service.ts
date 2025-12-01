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
  id_authentication?: string | null; // UUID do Auth
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

  // ATUALIZADO: Agora recebe a senha também
  async createUsuario(usuario: Omit<IUsuario, 'id' | 'created_at'>, senhaTemporaria: string) {
    
    // 1. Tenta criar o usuário na Autenticação do Supabase (Auth)
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email: usuario.email,
      password: senhaTemporaria,
      options: {
        data: { nome: usuario.nome } // Metadados opcionais
      }
    });

    if (authError) {
      console.error('Erro ao criar Login:', authError);
      throw new Error(`Erro no Auth: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('Usuário criado, mas sem ID retornado.');
    }

    // 2. Se deu certo, pega o UUID gerado e insere na tabela de dados
    const usuarioParaBanco = {
      ...usuario,
      id_authentication: authData.user.id // O tal campo que estava faltando!
    };

    const { data, error } = await this.supabase
      .from(this.TABLE)
      .insert(usuarioParaBanco)
      .select()
      .single();

    if (error) {
      // Se der erro no banco, o ideal seria desfazer o Auth, mas vamos focar no erro atual.
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