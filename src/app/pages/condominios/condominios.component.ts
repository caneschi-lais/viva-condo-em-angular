import { Component, inject, signal, OnInit, NgZone } from '@angular/core'; // 1. Adicionado NgZone
import { CondominioService, ICondominio } from '../../services/condominio.service';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-condominios',
  standalone: true,
  imports: [SidebarComponent, CommonModule, LucideAngularModule, ReactiveFormsModule],
  template: `
    <div class="flex h-screen bg-base-200">
      <app-sidebar />
      
      <main class="flex-1 p-8 overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-base-content">Condomínios</h1>
          <button class="btn btn-primary" onclick="modalCriar.showModal()">
            <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
            Novo Condomínio
          </button>
        </div>

        <div class="overflow-x-auto bg-base-100 rounded-box shadow">
          <table class="table table-zebra">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Endereço</th>
                <th>Cidade/UF</th>
                <th>Tipo</th>
                <th class="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              @if (loading()) {
                <tr>
                  <td colspan="5" class="text-center py-10">
                    <div class="flex flex-col items-center gap-4">
                      <span class="loading loading-spinner loading-lg text-primary"></span>
                      <span class="text-gray-500 font-medium">Carregando condomínios...</span>
                    </div>
                  </td>
                </tr>
              } @else {
                @for (c of condominios(); track c.id) {
                  <tr>
                    <td>
                      <div class="font-bold">{{ c.nome_condominio }}</div>
                      <div class="text-xs opacity-50">ID: {{ c.id }}</div>
                    </td>
                    <td>
                      {{ c.endereco_condominio || 'Sem endereço' }}
                    </td>
                    <td>{{ c.cidade_condominio }} - {{ c.uf_condominio }}</td>
                    <td>
                      <div class="badge badge-outline" 
                           [ngClass]="{
                             'badge-primary': c.tipo_condominio === 'Residencial',
                             'badge-secondary': c.tipo_condominio === 'Comercial',
                             'badge-accent': c.tipo_condominio === 'Misto'
                           }">
                        {{ c.tipo_condominio }}
                      </div>
                    </td>
                    <td class="text-center">
                      <div class="flex gap-2 justify-center">
                        <button class="btn btn-ghost btn-xs text-info tooltip" data-tip="Editar"> 
                          <lucide-icon name="pencil" class="w-4 h-4"></lucide-icon>
                        </button>                    
                        <button class="btn btn-ghost btn-xs text-error tooltip" data-tip="Excluir">
                          <lucide-icon name="trash-2" class="w-4 h-4"></lucide-icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
                
                @if (condominios().length === 0) {
                  <tr>
                    <td colspan="5" class="text-center py-8 text-gray-500">
                      Nenhum condomínio encontrado.
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </main>
    </div>

    <dialog #modalCriar id="modalCriar" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Novo Condomínio</h3>
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <form>
          <div class="form-control w-full">
            <label class="label"><span class="label-text">Nome</span></label>
            <input type="text" placeholder="Nome do condomínio" class="input input-bordered w-full" />
          </div>
          <div class="modal-action">
             <button class="btn">Cancelar</button>
             <button class="btn btn-primary">Salvar</button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  `
})
export class CondominiosComponent implements OnInit {
  private condominioService = inject(CondominioService);
  private ngZone = inject(NgZone); // 3. Injeção do NgZone
  
  condominios = signal<ICondominio[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.listarCondominios();
  }

  async listarCondominios() {
    this.loading.set(true);
    
    try {
      // Busca os dados no Supabase
      const data = await this.condominioService.getCondominios();
      
      // 4. O segredo: Forçar a atualização dentro da Zona do Angular
      this.ngZone.run(() => {
        this.condominios.set(data);
        this.loading.set(false); // Só remove o loading quando os dados estiverem prontos
      });

    } catch (error) {
      console.error('Erro ao carregar:', error);
      this.ngZone.run(() => {
        this.loading.set(false);
      });
    }
  }
}