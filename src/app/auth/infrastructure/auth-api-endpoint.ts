import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { User } from '../domain/model/user.entity';
import { LoginCredentials } from '../domain/model/login-credentials';
import { RegisterData } from '../domain/model/register-data';
import { UserResource, LoginResponse, RegisterResponse } from './auth-response';
import { AuthAssembler } from './auth-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

export class AuthApiEndpoint extends BaseApiEndpoint<User, UserResource, any, AuthAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}/auth`, new AuthAssembler());
  }

  /**
   * Authenticates a user with the provided credentials.
   * @param credentials - The login credentials.
   * @returns An Observable of the authenticated User.
   */
  login(credentials: LoginCredentials) {
    return this.http.post<LoginResponse>(`${this.endpointUrl}/login`, credentials).pipe(
      map(response => this.assembler.toEntityFromResource(response.user))
    );
  }

  /**
   * Registers a new user with the provided data.
   * @param data - The registration data.
   * @returns An Observable of the created User.
   */
  register(data: RegisterData) {
    return this.http.post<RegisterResponse>(`${this.endpointUrl}/register`, data).pipe(
      map(response => this.assembler.toEntityFromResource(response.user))
    );
  }

  /**
   * Logs out the current user.
   * @returns An Observable that completes when logout is successful.
   */
  logout() {
    return this.http.post<void>(`${this.endpointUrl}/logout`, {});
  }
}
