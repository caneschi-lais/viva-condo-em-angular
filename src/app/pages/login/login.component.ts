import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-base-200">
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title justify-center text-2xl font-bold">Bem-vindo 👋</h2>
          <p class="text-center text-gray-500 mb-4">Acesse o Viva Condo</p>

          <div *ngIf="error()" class="alert alert-error text-sm py-2">
            <span>{{ error() }}</span>
          </div>

          <form (ngSubmit)="login()">
            <div class="form-control w-full">
              <label class="label"><span class="label-text">E-mail</span></label>
              <input type="email" [(ngModel)]="email" name="email" placeholder="seu@email.com" class="input input-bordered w-full" required />
            </div>

            <div class="form-control w-full mt-2">
              <label class="label"><span class="label-text">Senha</span></label>
              <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" class="input input-bordered w-full" required />
            </div>

            <div class="card-actions justify-end mt-6">
              <button class="btn btn-primary w-full" [disabled]="loading()">
                <span *ngIf="loading()" class="loading loading-spinner"></span>
                {{ loading() ? 'Entrando...' : 'Acessar Sistema' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private supabase = inject(SupabaseService).client;
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  async login() {
    this.loading.set(true);
    this.error.set(null);

    const { error } = await this.supabase.auth.signInWithPassword({
      email: this.email,
      password: this.password,
    });

    if (error) {
      this.error.set("Erro ao logar: " + error.message);
      this.loading.set(false);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}