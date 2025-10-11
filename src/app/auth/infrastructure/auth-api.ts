import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { AuthApiEndpoint } from './auth-api-endpoint';
import { HttpClient } from '@angular/common/http';
import { User } from '../domain/model/user.entity';
import { LoginCredentials } from '../domain/model/login-credentials';
import { RegisterData } from '../domain/model/register-data';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthApi extends BaseApi {
  private readonly authEndpoint: AuthApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.authEndpoint = new AuthApiEndpoint(http);
  }

  /**
   * Authenticates a user with the provided credentials.
   * @param credentials - The login credentials.
   * @returns An Observable of the authenticated User.
   */
  login(credentials: LoginCredentials): Observable<User> {
    return this.authEndpoint.login(credentials);
  }

  /**
   * Registers a new user with the provided data.
   * @param data - The registration data.
   * @returns An Observable of the created User.
   */
  register(data: RegisterData): Observable<User> {
    return this.authEndpoint.register(data);
  }

  /**
   * Gets user information by ID.
   * @param userId - The user ID.
   * @returns An Observable of the User with complete information.
   */
  getUserById(userId: string): Observable<any> {
    return this.authEndpoint.getUserById(userId);
  }

  /**
   * Logs out the current user.
   * @returns An Observable that completes when logout is successful.
   */
  logout(): Observable<void> {
    return this.authEndpoint.logout();
  }
}
