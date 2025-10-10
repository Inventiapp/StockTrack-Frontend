import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { User } from '../domain/model/user.entity';
import { LoginCredentials } from '../domain/model/login-credentials';
import { RegisterData } from '../domain/model/register-data';
import { UserAssembler } from './user-assembler';
import { LoginResponse, RegisterResponse } from './auth-response';

/**
 * Service for handling authentication API calls.
 * @remarks
 * This service manages communication with the authentication backend.
 * Currently uses mock data for development purposes.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly assembler = new UserAssembler();
  private readonly apiUrl = 'http://localhost:3000/api/v1/auth'; // TODO: Move to environment

  constructor(private http: HttpClient) {}

  /**
   * Authenticates a user with the provided credentials.
   * @param credentials - The login credentials.
   * @returns An Observable of the authenticated User.
   */
  login(credentials: LoginCredentials): Observable<User> {
    return of({
      user: {
        id: '1',
        email: credentials.email,
        name: 'Usuario Demo',
        role: 'admin',
        token: 'mock-jwt-token-' + Date.now()
      },
      token: 'mock-jwt-token-' + Date.now()
    } as LoginResponse).pipe(
      delay(1000),
      map(response => this.assembler.toEntityFromResource(response.user))
    );

  }

  /**
   * Registers a new user with the provided data.
   * @param data - The registration data.
   * @returns An Observable of the created User.
   */
  register(data: RegisterData): Observable<User> {
    return of({
      user: {
        id: '2',
        email: data.email,
        name: data.name,
        role: 'user',
        token: 'mock-jwt-token-' + Date.now()
      },
      token: 'mock-jwt-token-' + Date.now()
    } as RegisterResponse).pipe(
      delay(1000), 
      map(response => this.assembler.toEntityFromResource(response.user))
    );


  }

  /**
   * Logs out the current user.
   * @returns An Observable that completes when logout is successful.
   */
  logout(): Observable<void> {
    return of(void 0).pipe(delay(500));

  }
}

