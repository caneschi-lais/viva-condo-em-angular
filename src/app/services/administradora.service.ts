import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface IAdministradora {
  id_administradora: number;
  nome_administradora: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdministradoraService {
  private supabase = inject(SupabaseService).client;
  private TABLE = 'administradora'; // Nome exato do banco

  async getAdministradoras(): Promise<IAdministradora[]> {
    const { data, error } = await this.supabase
      .from(this.TABLE)
      .select('id_administradora, nome_administradora')
      .order('nome_administradora', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}