import { Component, inject, signal, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [SidebarComponent, CommonModule, LucideAngularModule],
  template: `
    <div class="flex h-screen bg-base-200">
      <app-sidebar />
      
      <main class="flex-1 p-8 overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-base-content">Usuarios</h1>
        </div>

        <div class="overflow-x-auto bg-base-100 rounded-box shadow">
          <table class="table table-zebra">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
          </table>
        </div>
        
      </main>

    </div>
  `
})
export class UsuariosComponent {


}