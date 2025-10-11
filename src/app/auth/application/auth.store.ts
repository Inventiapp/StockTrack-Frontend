import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../domain/model/user.entity';
import { LoginCredentials } from '../domain/model/login-credentials';
import { RegisterData } from '../domain/model/register-data';
import { AuthApi } from '../infrastructure/auth-api';
import { JwtTokenService } from '../infrastructure/jwt-token';

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
  private readonly initializedSignal = signal<boolean>(false);
  private initializationPromise: Promise<void> | null = null;

  readonly user = this.userSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly initialized = this.initializedSignal.asReadonly();

  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly currentUser = computed(() => this.user());
  readonly currentUserName = computed(() => this.user()?.name || 'Usuario');

  constructor(
    private authApi: AuthApi,
    private tokenService: JwtTokenService,
    private router: Router
  ) {
    this.initializeAuth();
  }

  /**
   * Initializes authentication state from stored token.
   */
  private initializeAuth(): void {
    this.initializationPromise = new Promise<void>((resolve) => {
      if (this.tokenService.hasToken() && !this.tokenService.isTokenExpired()) {
        const decoded = this.tokenService.decodeToken();
        if (decoded) {
          const userId = String(decoded.sub);
          
          // Obtener información completa del usuario incluyendo el rol
          this.authApi.getUserById(userId).subscribe({
            next: (userData: any) => {
              this.userSignal.set(new User({
                id: userId,
                email: decoded.email,
                name: userData.name || decoded.email.split('@')[0],
                role: userData.role || 'Vendedor'
              }));
              this.initializedSignal.set(true);
              resolve();
            },
            error: (err: Error) => {
              // Si falla la petición, usar datos básicos del JWT
              this.userSignal.set(new User({
                id: userId,
                email: decoded.email,
                name: decoded.email.split('@')[0],
                role: 'Vendedor' // Rol por defecto
              }));
              this.initializedSignal.set(true);
              resolve();
            }
          });
        } else {
          this.initializedSignal.set(true);
          resolve();
        }
      } else {
        this.initializedSignal.set(true);
        resolve();
      }
    });
  }

  /**
   * Waits for the authentication store to be fully initialized.
   * @returns A promise that resolves when initialization is complete.
   */
  waitForInitialization(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    return Promise.resolve();
  }

  /**
   * Authenticates a user with the provided credentials.
   * @param credentials - The login credentials.
   * @param returnUrl - Optional URL to redirect to after successful login.
   */
  login(credentials: LoginCredentials, returnUrl: string = '/dashboard'): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.authApi.login(credentials).subscribe({
      next: (response: any) => {
        if (response.accessToken) {
          this.tokenService.setToken(response.accessToken);
        }
        
        const user = response.user;
        const userId = String(user.id);
        
        // Obtener información completa del usuario incluyendo el rol
        this.authApi.getUserById(userId).subscribe({
          next: (userData: any) => {
            this.userSignal.set(new User({
              id: userId,
              email: user.email,
              name: userData.name || user.firstname || user.email,
              role: userData.role || 'Vendedor' // Usar el rol de la API o por defecto
            }));
            
            this.loadingSignal.set(false);
            this.router.navigateByUrl(returnUrl);
          },
          error: (err: Error) => {
            // Si falla la petición del usuario, usar datos básicos
            this.userSignal.set(new User({
              id: userId,
              email: user.email,
              name: user.firstname || user.email,
              role: 'Vendedor' // Rol por defecto
            }));
            
            this.loadingSignal.set(false);
            this.router.navigateByUrl(returnUrl);
          }
        });
      },
      error: (err: Error) => {
        this.errorSignal.set(this.formatError(err, 'Error during login'));
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
      next: (response: any) => {
        if (response.accessToken) {
          this.tokenService.setToken(response.accessToken);
        }
        
        const user = response.user;
        this.userSignal.set(new User({
          id: String(user.id),
          email: user.email,
          name: user.name || user.email,
          role: user.role
        }));
        
        this.loadingSignal.set(false);
        
        this.router.navigate(['/dashboard']);
      },
      error: (err: Error) => {
        this.errorSignal.set(this.formatError(err, 'Error during registration'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Logs out the current user.
   */
  logout(): void {
    this.tokenService.removeToken();
    
    this.userSignal.set(null);
    
    this.router.navigate(['/auth/login']);
  }

  /**
   * Clears the current error.
   */
  clearError(): void {
    this.errorSignal.set(null);
  }

  /**
   * Formats error messages for better user experience.
   * @param error - The error object.
   * @param fallback - The fallback message if error is not an Error instance.
   * @returns A formatted error message.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
