import { Component, inject, signal, OnInit } from '@angular/core';
import { CondominioService, ICondominio } from '../../services/condominio.service';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-condominios',
  standalone: true,
  imports: [SidebarComponent, CommonModule, LucideAngularModule],
  template: `
    <div class="flex h-screen bg-base-200">
      <app-sidebar />
      
      <main class="flex-1 p-8 overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-base-content">Condomínios</h1>
          <button class="btn btn-primary" onclick="modal_criar.showModal()">
            <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
            Novo
          </button>
        </div>

        <div class="overflow-x-auto bg-base-100 rounded-box shadow">
          <table class="table table-zebra">
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Cidade/UF</th>
                <th>Tipo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of condominios(); let i = index">
                <th>{{ i + 1 }}</th>
                <td>
                  <div class="font-bold">{{ c.nome_condominio }}</div>
                  <div class="text-sm opacity-50">{{ c.endereco_condominio }}</div>
                </td>
                <td>{{ c.cidade_condominio }} - {{ c.uf_condominio }}</td>
                <td>
                  <div class="badge badge-accent badge-outline">{{ c.tipo_condominio }}</div>
                </td>
                <td>
                  <button class="btn btn-ghost btn-xs text-error" (click)="deletar(c.id)">
                    <lucide-icon name="trash-2" class="w-4 h-4"></lucide-icon>
                  </button>
                </td>
              </tr>
              
              <tr *ngIf="condominios().length === 0">
                <td colspan="5" class="text-center py-4">Nenhum condomínio encontrado.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>

    <dialog id="modal_criar" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Novo Condomínio</h3>
        <p class="py-4">Aqui iria o formulário (Reactive Forms)...</p>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn">Fechar</button>
          </form>
        </div>
      </div>
    </dialog>
  `
})
export class CondominiosComponent implements OnInit {
  private condominioService = inject(CondominioService);
  
  condominios = signal<ICondominio[]>([]);

  async ngOnInit() {
    this.carregar();
  }

  async carregar() {
    const data = await this.condominioService.getCondominios();
    this.condominios.set(data);
  }

  async deletar(id: number) {
    if(confirm('Tem certeza?')) {
      await this.condominioService.deleteCondominio(id);
      this.carregar();
    }
  }
}