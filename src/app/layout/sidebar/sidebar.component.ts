import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <aside class="w-64 bg-base-100 border-r border-base-300 h-screen flex flex-col">
      <div class="p-4 bg-primary text-primary-content flex justify-center">
        <h1 class="text-xl font-bold">VIVA CONDO</h1>
      </div>

      <ul class="menu p-4 w-full text-base-content gap-2">
        <li>
          <a routerLink="/condominios" routerLinkActive="active" class="font-medium">
            <lucide-icon name="building-2" class="w-5 h-5"></lucide-icon>
            Condomínios
          </a>
        </li>
        <li>
          <a routerLink="/usuarios" routerLinkActive="active" class="font-medium">
            <lucide-icon name="users" class="w-5 h-5"></lucide-icon>
            Usuários
          </a>
        </li>
      </ul>

      <div class="mt-auto p-4 border-t border-base-300">
        <button class="btn btn-ghost w-full justify-start text-error gap-3" (click)="logout()">
          <lucide-icon name="log-out" class="w-5 h-5"></lucide-icon>
          Sair
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  private supabase = inject(SupabaseService).client;
  private router = inject(Router);

  async logout() {
    await this.supabase.auth.signOut();
    
    this.router.navigate(['/']);
  }
}