/**
 * Represents the data required for user registration.
 * @remarks
 * This class encapsulates all information needed to create a new user account.
 */
export class RegisterData {
  /**
   * Creates a new RegisterData instance.
   * @param data - An object containing registration information.
   * @returns A new instance of RegisterData.
   */
  constructor(data: {
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
  }) {
    this._email = data.email;
    this._password = data.password;
    this._name = data.name;
    this._confirmPassword = data.confirmPassword;
  }

  /**
   * The email address for the new account.
   */
  private _email: string;
  get email(): string {
    return this._email;
  }
  set email(value: string) {
    this._email = value;
  }

  /**
   * The password for the new account.
   */
  private _password: string;
  get password(): string {
    return this._password;
  }
  set password(value: string) {
    this._password = value;
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
   * The password confirmation.
   */
  private _confirmPassword: string;
  get confirmPassword(): string {
    return this._confirmPassword;
  }
  set confirmPassword(value: string) {
    this._confirmPassword = value;
  }
}
