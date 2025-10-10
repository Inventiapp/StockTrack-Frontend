import { Injectable, signal, computed } from '@angular/core';
import { User } from '../domain/model/user.entity';
import { LoginCredentials } from '../domain/model/login-credentials';
import { RegisterData } from '../domain/model/register-data';
import { AuthApi } from '../infrastructure/auth-api';

/**
 * Store for managing authentication state and operations.
 * @remarks
 * This service orchestrates authentication use cases and manages auth state.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private readonly userSignal = signal<User | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly user = this.userSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly currentUser = computed(() => this.user());

  constructor(private authApi: AuthApi) {}

  /**
   * Authenticates a user with the provided credentials.
   * @param credentials - The login credentials.
   */
  login(credentials: LoginCredentials): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.authApi.login(credentials).subscribe({
      next: (user) => {
        this.userSignal.set(user);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set('Error during login');
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Registers a new user with the provided data.
   * @param data - The registration data.
   */
  register(data: RegisterData): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.authApi.register(data).subscribe({
      next: (user) => {
        this.userSignal.set(user);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set('Error during registration');
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Logs out the current user.
   */
  logout(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.authApi.logout().subscribe({
      next: () => {
        this.userSignal.set(null);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set('Error during logout');
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Clears the current error.
   */
  clearError(): void {
    this.errorSignal.set(null);
  }
}
