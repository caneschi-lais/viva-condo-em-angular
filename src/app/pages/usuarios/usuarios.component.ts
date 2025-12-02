import { Component, inject, signal, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { UsuarioService, IUsuario } from '../../services/usuario.service';
import { AdministradoraService, IAdministradora } from '../../services/administradora.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [SidebarComponent, CommonModule, LucideAngularModule, ReactiveFormsModule],
  template: `
    <div class="flex h-screen bg-base-200">
      <app-sidebar />
      
      <main class="flex-1 p-8 overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-base-content">Usuários</h1>
          <button class="btn btn-primary" (click)="abrirModal(modalUsuario)">
            <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
            Novo Usuário
          </button>
        </div>

        <div class="overflow-x-auto bg-base-100 rounded-box shadow">
          <table class="table table-zebra">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Tipo de Acesso</th>
                <th>Administradora</th> 
                <th class="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              @if (loading()) {
                <tr>
                  <td colspan="6" class="text-center py-10">
                    <span class="loading loading-spinner loading-lg text-primary"></span>
                  </td>
                </tr>
              } @else {
                @for (u of usuarios(); track u.id) {
                  <tr>
                    <td><div class="font-bold">{{ u.nome }}</div></td>
                    <td>{{ u.email }}</td>
                    <td>{{ u.telefone || '-' }}</td>
                    <td>
                      <div class="badge badge-sm"
                        [ngClass]="{
                          'badge-primary': u.tipo_acesso === 'admin',
                          'badge-neutral': u.tipo_acesso === 'usuario'
                        }">
                        {{ u.tipo_acesso }}
                      </div>
                    </td>
                    <td>{{ u.id_administradora }}</td>
                    <td class="text-center">
                      <div class="flex gap-2 justify-center">
                        <button class="btn btn-ghost btn-xs text-error" (click)="deletarUsuario(u.id)">
                          <lucide-icon name="trash-2" class="w-4 h-4"></lucide-icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </main>
    </div>

    <dialog #modalUsuario class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Novo Usuário</h3>
        
        <form [formGroup]="userForm" (ngSubmit)="salvarUsuario(modalUsuario)">
          
          <div class="form-control w-full">
            <label class="label"><span class="label-text">Nome *</span></label>
            <input type="text" formControlName="nome" class="input input-bordered w-full" placeholder="Nome completo" />
          </div>

          <div class="flex gap-2 mt-2">
            <div class="form-control w-1/2">
                <label class="label"><span class="label-text">E-mail *</span></label>
                <input type="email" formControlName="email" class="input input-bordered w-full" placeholder="email@exemplo.com" />
            </div>
            
            <div class="form-control w-1/2">
                <label class="label"><span class="label-text">Senha *</span></label>
                <input type="password" formControlName="senha" class="input input-bordered w-full" placeholder="******" />
            </div>
          </div>

          <div class="form-control w-full mt-2">
            <label class="label"><span class="label-text">Telefone</span></label>
            <input type="text" formControlName="telefone" class="input input-bordered w-full" placeholder="(00) 00000-0000" />
          </div>

          <div class="flex gap-2 mt-2">
            <div class="form-control w-1/2">
              <label class="label"><span class="label-text">Administradora *</span></label>
              <select formControlName="id_administradora" class="select select-bordered w-full">
                <option value="" disabled selected>Selecione...</option>
                @for (adm of administradoras(); track adm.id_administradora) {
                  <option [value]="adm.id_administradora">
                    {{ adm.nome_administradora }}
                  </option>
                }
              </select>
            </div>

            <div class="form-control w-1/2">
              <label class="label"><span class="label-text">Tipo de Acesso *</span></label>
              <select formControlName="tipo_acesso" class="select select-bordered w-full">
                <option value="" disabled selected>Selecione...</option>
                <option value="usuario">Usuário</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div class="modal-action">
            <button type="button" class="btn" (click)="modalUsuario.close()">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="userForm.invalid || salvando()">
              {{ salvando() ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button (click)="modalUsuario.close()">close</button>
      </form>
    </dialog>
  `
})
export class UsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private administradoraService = inject(AdministradoraService);
  private ngZone = inject(NgZone);
  private fb = inject(FormBuilder);

  usuarios = signal<IUsuario[]>([]);
  administradoras = signal<IAdministradora[]>([]);
  loading = signal(true);
  salvando = signal(false);

  userForm: FormGroup = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]], 
    telefone: [''],
    tipo_acesso: ['', Validators.required],
    id_administradora: ['', Validators.required]
  });

  ngOnInit() {
    this.carregarDadosIniciais();
  }

  async carregarDadosIniciais() {
    this.loading.set(true);
    try {
      const [users, adms] = await Promise.all([
        this.usuarioService.getUsuarios(),
        this.administradoraService.getAdministradoras()
      ]);

      this.ngZone.run(() => {
        this.usuarios.set(users);
        this.administradoras.set(adms);
        this.loading.set(false);
      });

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      this.loading.set(false);
    }
  }

  abrirModal(modal: HTMLDialogElement) {
    this.userForm.reset();
    this.userForm.patchValue({ 
      tipo_acesso: 'usuario',
      id_administradora: '' 
    });
    modal.showModal();
  }

  async salvarUsuario(modal: HTMLDialogElement) {
    if (this.userForm.invalid) return;

    this.salvando.set(true);
    const formValue = this.userForm.value;

    const novoUsuario: any = {
      nome: formValue.nome,
      email: formValue.email,
      telefone: formValue.telefone,
      tipo_acesso: formValue.tipo_acesso,
      id_administradora: Number(formValue.id_administradora)
    };

    const senha = formValue.senha;

    try {
      await this.usuarioService.createUsuario(novoUsuario, senha);
      
      modal.close();
      const users = await this.usuarioService.getUsuarios();
      this.ngZone.run(() => {
        this.usuarios.set(users);
      });
      alert('Usuário criado com sucesso!');
      
    } catch (error: any) {
      console.error('Erro detalhado:', error);
      const mensagemErro = error.message || 'Erro desconhecido';
      alert(`Erro: ${mensagemErro}`);
    } finally {
      this.salvando.set(false);
    }
  }

  async deletarUsuario(id: number) {
    if(!confirm('Tem certeza?')) return;
    try {
      await this.usuarioService.deleteUsuario(id);
      const users = await this.usuarioService.getUsuarios();
      this.ngZone.run(() => {
        this.usuarios.set(users);
      });
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  }
}