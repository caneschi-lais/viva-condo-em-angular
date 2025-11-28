import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface ICondominio {
  id: number;
  nome_condominio: string;
  endereco_condominio: string | null;
  cidade_condominio: string;
  uf_condominio: string;
  tipo_condominio: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class CondominioService {
  private supabase = inject(SupabaseService).client;
  private TABLE = 'condominio';

  async getCondominios(): Promise<ICondominio[]> {
    const { data, error } = await this.supabase
      .from(this.TABLE)
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async createCondominio(condominio: Omit<ICondominio, 'id'>) {
    const { data, error } = await this.supabase
      .from(this.TABLE)
      .insert(condominio)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteCondominio(id: number) {
    const { error } = await this.supabase
      .from(this.TABLE)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}