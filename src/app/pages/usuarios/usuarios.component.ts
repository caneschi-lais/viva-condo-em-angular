import { Component, inject, signal, OnInit, NgZone } from '@angular/core';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { UsuarioService, IUsuario } from '../../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [SidebarComponent, CommonModule, LucideAngularModule],
  template: `
    <div class="flex h-screen bg-base-200">
      <app-sidebar />
      
      <main class="flex-1 p-8 overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-base-content">Usuários</h1>
          <button class="btn btn-primary">
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
                <th class="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              @if (loading()) {
                <tr>
                  <td colspan="5" class="text-center py-10">
                    <div class="flex flex-col items-center gap-4">
                      <span class="loading loading-spinner loading-lg text-primary"></span>
                      <span class="text-gray-500 font-medium">Carregando usuários...</span>
                    </div>
                  </td>
                </tr>
              } @else {
                @for (u of usuarios(); track u.id) {
                  <tr>
                    <td>
                      <div class="font-bold">{{ u.Nome }}</div>
                      <div class="text-xs opacity-50">ID: {{ u.id }}</div>
                    </td>
                    <td>
                      {{ u.Email }}
                    </td>
                    <td>
                      {{ u.Telefone || 'Não informado' }}
                    </td>
                    <td>
                      <div class="badge badge-sm"
                        [ngClass]="{
                          'badge-primary': u.Tipo_acesso === 'admin' || u.Tipo_acesso === 'Admin',
                          'badge-secondary': u.Tipo_acesso === 'morador' || u.Tipo_acesso === 'Morador',
                          'badge-ghost': !u.Tipo_acesso
                        }">
                        {{ u.Tipo_acesso || 'N/A' }}
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

                @if (usuarios().length === 0) {
                  <tr>
                    <td colspan="5" class="text-center py-8 text-gray-500">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `
})
export class UsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private ngZone = inject(NgZone); // Essencial para atualizar a tela de uma vez

  usuarios = signal<IUsuario[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.listarUsuarios();
  }

  async listarUsuarios() {
    this.loading.set(true);

    try {
      const data = await this.usuarioService.getUsuarios();

      // Força a atualização dentro da zona do Angular para evitar o efeito "linha por linha"
      this.ngZone.run(() => {
        this.usuarios.set(data);
        this.loading.set(false);
      });

    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      this.ngZone.run(() => {
        this.loading.set(false);
      });
    }
  }
}