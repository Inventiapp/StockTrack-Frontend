import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { User } from '../domain/model/user.entity';
import { LoginCredentials } from '../domain/model/login-credentials';
import { RegisterData } from '../domain/model/register-data';
import { UserResource, LoginResponse, RegisterResponse } from './auth-response';
import { AuthAssembler } from './auth-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

export class AuthApiEndpoint extends BaseApiEndpoint<User, UserResource, LoginResponse, AuthAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiBaseUrl}`, new AuthAssembler());
  }

  /**
   * Authenticates a user with the provided credentials.
   * @param credentials - The login credentials.
   * @returns An Observable of the login response with token.
   * @remarks Uses json-server-auth /login endpoint
   */
  login(credentials: LoginCredentials) {
    return this.http.post<any>(`${this.endpointUrl}/login`, {
      email: credentials.email,
      password: credentials.password
    });
  }

  /**
   * Registers a new user with the provided data.
   * @param data - The registration data.
   * @returns An Observable of the register response with token.
   * @remarks Uses json-server-auth /register endpoint
   */
  register(data: RegisterData) {
    return this.http.post<any>(`${this.endpointUrl}/register`, {
      email: data.email,
      password: data.password,
      name: data.name
    });
  }

  /**
   * Gets user information by ID.
   * @param userId - The user ID.
   * @returns An Observable of the user data with complete information.
   */
  getUserById(userId: string) {
    return this.http.get<any>(`${this.endpointUrl}/users/${userId}`);
  }

  /**
   * Logs out the current user.
   * @returns An Observable that completes when logout is successful.
   */
  logout() {
    return this.http.post<void>(`${this.endpointUrl}/logout`, {});
  }
}
