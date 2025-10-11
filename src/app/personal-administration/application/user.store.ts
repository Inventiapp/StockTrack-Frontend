import { Injectable, signal, computed } from '@angular/core';
import { User, UserRole, UserStatus } from '../domain/user.model';
import { UserApi } from '../infrastructure/user-api';

/**
 * Store for managing user state and operations.
 * @remarks
 * This service orchestrates user use cases and manages user state.
 */
@Injectable({
  providedIn: 'root'
})
export class UserStore {
  private readonly usersSignal = signal<User[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly users = this.usersSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly hasUsers = computed(() => this.users().length > 0);
  readonly activeUsers = computed(() => this.users().filter(user => user.isActive()));
  readonly adminUsers = computed(() => this.users().filter(user => user.isAdmin()));

  // Available roles (static data)
  readonly availableRoles = [
    { name: 'Vendedor', permissions: { productos: true, compras: true, estadisticas: false, usuarios: false } },
    { name: 'Administrador', permissions: { productos: true, compras: true, estadisticas: true, usuarios: true } }
  ];

  constructor(private userApi: UserApi) {
    this.loadUsers();
  }

  /**
   * Loads all users.
   */
  loadUsers(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.userApi.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.usersSignal.set(users);
        this.loadingSignal.set(false);
      },
      error: (err: Error) => {
        this.errorSignal.set(this.formatError(err, 'Error loading users'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Creates a new user.
   * @param userData - The user data to create.
   */
  createUser(userData: {
    name: string;
    role: UserRole;
    email: string;
    password: string;
    status: UserStatus;
  }): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const newUser = new User({
      id: '',
      name: userData.name,
      role: userData.role,
      email: userData.email,
      password: userData.password,
      status: userData.status
    });

    this.userApi.createUser(newUser).subscribe({
      next: (user: User) => {
        const currentUsers = this.users();
        this.usersSignal.set([...currentUsers, user]);
        this.loadingSignal.set(false);
      },
      error: (err: Error) => {
        this.errorSignal.set(this.formatError(err, 'Error creating user'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates an existing user.
   * @param id - The user ID.
   * @param userData - The updated user data.
   */
  updateUser(id: string, userData: {
    name: string;
    role: UserRole;
    email: string;
    status: UserStatus;
  }): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const updatedUser = new User({
      id: id,
      name: userData.name,
      role: userData.role,
      email: userData.email,
      status: userData.status
    });

    this.userApi.updateUser(id, updatedUser).subscribe({
      next: (user: User) => {
        const currentUsers = this.users();
        const updatedUsers = currentUsers.map(u => u.id === id ? user : u);
        this.usersSignal.set(updatedUsers);
        this.loadingSignal.set(false);
      },
      error: (err: Error) => {
        this.errorSignal.set(this.formatError(err, 'Error updating user'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes a user.
   * @param id - The user ID.
   */
  deleteUser(id: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.userApi.deleteUser(id).subscribe({
      next: (success: boolean) => {
        if (success) {
          const currentUsers = this.users();
          const filteredUsers = currentUsers.filter(u => u.id !== id);
          this.usersSignal.set(filteredUsers);
        }
        this.loadingSignal.set(false);
      },
      error: (err: Error) => {
        this.errorSignal.set(this.formatError(err, 'Error deleting user'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Refreshes user data.
   */
  refresh(): void {
    this.loadUsers();
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
