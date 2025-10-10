import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../domain/model/user.entity';
import { LoginCredentials } from '../domain/model/login-credentials';
import { RegisterData } from '../domain/model/register-data';
import { AuthApiService } from '../infrastructure/auth-api.service';

/**
 * Store for managing authentication state and operations.
 * @remarks
 * This service orchestrates authentication use cases and manages user state.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private readonly currentUserSignal = signal<User | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly userRole = computed(() => this.currentUser()?.role);

  constructor(
    private authApi: AuthApiService,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  /**
   * Authenticates a user with credentials.
   */
  login(credentials: LoginCredentials): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.authApi.login(credentials).subscribe({
      next: (user) => {
        this.currentUserSignal.set(user);
        this.saveUserToStorage(user);
        this.loadingSignal.set(false);
        this.router.navigate(['/inventory']);
      },
      error: (err) => {
        this.errorSignal.set('auth.errors.loginFailed');
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Registers a new user.
   */
  register(data: RegisterData): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    if (data.password !== data.confirmPassword) {
      this.errorSignal.set('auth.errors.passwordMismatch');
      this.loadingSignal.set(false);
      return;
    }

    this.authApi.register(data).subscribe({
      next: (user) => {
        this.currentUserSignal.set(user);
        this.saveUserToStorage(user);
        this.loadingSignal.set(false);
        this.router.navigate(['/inventory']);
      },
      error: (err) => {
        this.errorSignal.set('auth.errors.registerFailed');
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Logs out the current user.
   */
  logout(): void {
    this.authApi.logout().subscribe({
      next: () => {
        this.currentUserSignal.set(null);
        this.clearUserFromStorage();
        this.router.navigate(['/auth/login']);
      }
    });
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      token: user.token
    }));
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const parsed = JSON.parse(userData);
      this.currentUserSignal.set(new User(parsed));
    }
  }

  private clearUserFromStorage(): void {
    localStorage.removeItem('currentUser');
  }
}
