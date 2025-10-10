import { BaseEntity } from '../../../shared/infrastructure/base-entity';

/**
 * Represents a User entity in the application.
 * @remarks
 * This class is used as a domain model for authenticated users.
 * It implements the BaseEntity interface to ensure consistency across entities.
 * @see {@link BaseEntity}
 */
export class User implements BaseEntity {
  /**
   * Creates a new User instance.
   * @param user - An object containing the user properties.
   * @returns A new instance of User.
   */
  constructor(user: {
    id: string;
    email: string;
    name: string;
    role?: string;
    token?: string;
  }) {
    this._id = user.id;
    this._email = user.email;
    this._name = user.name;
    this._role = user.role;
    this._token = user.token;
  }

  /**
   * The unique identifier for the user.
   */
  private _id: string;
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  /**
   * The email of the user.
   */
  private _email: string;
  get email(): string {
    return this._email;
  }
  set email(value: string) {
    this._email = value;
  }

  /**
   * The full name of the user.
   */
  private _name: string;
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  /**
   * The role of the user in the system.
   */
  private _role?: string;
  get role(): string | undefined {
    return this._role;
  }
  set role(value: string | undefined) {
    this._role = value;
  }

  /**
   * The authentication token for the user.
   */
  private _token?: string;
  get token(): string | undefined {
    return this._token;
  }
  set token(value: string | undefined) {
    this._token = value;
  }
}
