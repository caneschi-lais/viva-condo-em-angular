import { Component, inject, signal, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
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
          <button class="btn btn-primary" >
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
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              @for (c of condominios(); track c.id) {
                <tr>
                  <td>
                    <div class="font-bold">{{ c.nome_condominio }}</div>
                  </td>
                  <td>
                    {{ c.endereco_condominio }}
                  </td>
                  <td>{{ c.cidade_condominio }} - {{ c.uf_condominio }}</td>
                  <td>
                    <div class="badge badge-accent badge-outline">{{ c.tipo_condominio }}</div>
                  </td>
                  <td>
                    <div class="flex gap-2">
                      <button class="btn btn-info btn-xs font-bold"> 
                        <lucide-icon name="pencil" class="w-3 h-3"></lucide-icon>
                      </button>                    
                      
                      <button class="btn btn-error btn-xs font-bold">
                        Deletar
                        <lucide-icon name="trash-2" class="w-3 h-3"></lucide-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </main>
    </div>

    <dialog #modalCriar class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Novo Condomínio</h3>
        
        <form method="post">
          
          <div class="form-control w-full">
            <label class="label"><span class="label-text">Nome do Condomínio *</span></label>
            <input type="text" formControlName="nome_condominio" placeholder="Digite o nome" class="input input-bordered w-full"/>
          </div>

          <div class="form-control w-full mt-2">
            <label class="label"><span class="label-text">Endereço</span></label>
            <input type="text" formControlName="endereco_condominio" placeholder="Rua, Número..." class="input input-bordered w-full" />
          </div>

          <div class="flex gap-2 mt-2">
            <div class="form-control w-2/3">
              <label class="label"><span class="label-text">Cidade *</span></label>
              <input type="text" formControlName="cidade_condominio" placeholder="Cidade" class="input input-bordered w-full" />
            </div>

            <div class="form-control w-1/3">
              <label class="label"><span class="label-text">UF *</span></label>
              <input type="text" formControlName="uf_condominio" placeholder="SP" maxlength="2" class="input input-bordered w-full uppercase" />
            </div>
          </div>

          <div class="form-control w-full mt-2">
            <label class="label"><span class="label-text">Tipo</span></label>
            <select formControlName="tipo_condominio" class="select select-bordered w-full">
              <option value="Residencial">Residencial</option>
              <option value="Comercial">Comercial</option>
              <option value="Misto">Misto</option>
            </select>
          </div>

          <div class="modal-action">
            <button type="button" class="btn btn-error">Cancelar</button>
            <button type="submit" class="btn btn-primary">Salvar</button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button class="btn btn-ghost">X</button>
      </form>
    </dialog>
  `
})
export class CondominiosComponent {
private condominioService = inject(CondominioService);
condominios = signal<ICondominio[]>([]);
}