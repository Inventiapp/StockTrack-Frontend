import { BaseEntity } from '../../shared/infrastructure/base-entity';

/**
 * Represents a User entity in the personal administration context.
 * @remarks
 * This class encapsulates user information and business rules for user management.
 * It implements the BaseEntity interface.
 */
export class User implements BaseEntity {
  /**
   * Creates a new User instance.
   * @param user - An object containing the user properties.
   * @returns A new instance of User.
   */
  constructor(user: {
    id: string;
    name: string;
    role: UserRole;
    email: string;
    password?: string;
    status: UserStatus;
  }) {
    this._id = user.id;
    this._name = user.name;
    this._role = user.role;
    this._email = user.email;
    this._password = user.password || '';
    this._status = user.status;
  }

  private _id: string;
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  private _name: string;
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('User name cannot be empty');
    }
    this._name = value.trim();
  }

  private _role: UserRole;
  get role(): UserRole {
    return this._role;
  }
  set role(value: UserRole) {
    this._role = value;
  }

  private _email: string;
  get email(): string {
    return this._email;
  }
  set email(value: string) {
    if (!this.isValidEmail(value)) {
      throw new Error('Invalid email format');
    }
    this._email = value.toLowerCase().trim();
  }

  private _password: string;
  get password(): string {
    return this._password;
  }
  set password(value: string) {
    this._password = value;
  }

  private _status: UserStatus;
  get status(): UserStatus {
    return this._status;
  }
  set status(value: UserStatus) {
    this._status = value;
  }

  /**
   * Checks if the user is active.
   * @returns True if the user is active, false otherwise.
   */
  isActive(): boolean {
    return this._status === UserStatus.ACTIVE;
  }

  /**
   * Checks if the user has admin privileges.
   * @returns True if the user is an admin, false otherwise.
   */
  isAdmin(): boolean {
    return this._role === UserRole.ADMIN;
  }

  /**
   * Gets the full display name of the user.
   * @returns The full display name.
   */
  getDisplayName(): string {
    return this._name;
  }

  /**
   * Validates email format.
   * @param email - The email to validate.
   * @returns True if valid, false otherwise.
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

/**
 * Enum for user roles.
 */
export enum UserRole {
  VENDOR = 'Vendedor',
  ADMIN = 'Administrador'
}

/**
 * Enum for user status.
 */
export enum UserStatus {
  ACTIVE = 'Activo',
  INACTIVE = 'Inactivo'
}
