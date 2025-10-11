import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../domain/user.model';
import { UserResource, UserResponse, UserListResponse } from './user-response';
import { UserAssembler } from './user-assembler';
import { environment } from '../../../environments/environment';

/**
 * API endpoint definitions for user operations.
 * @remarks
 * This service defines the specific API endpoints for user management operations.
 */
@Injectable({
  providedIn: 'root'
})
export class UserApiEndpoint {
  private readonly baseUrl = `${environment.apiBaseUrl}/users`;

  constructor(private http: HttpClient, private assembler: UserAssembler) {}

  /**
   * Gets all users.
   * @returns Observable of User entities.
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<UserResource[]>(this.baseUrl).pipe(
      map(response => this.assembler.toEntitiesFromResources(response))
    );
  }

  /**
   * Gets a user by ID.
   * @param id - The user ID.
   * @returns Observable of User entity.
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<UserResponse>(`${this.baseUrl}/${id}`).pipe(
      map(response => this.assembler.toEntityFromResponse(response))
    );
  }

  /**
   * Creates a new user.
   * @param user - The user data to create.
   * @returns Observable of User entity.
   */
  createUser(user: User): Observable<User> {
    const resource = this.assembler.toResourceFromEntity(user);
    return this.http.post<UserResponse>(this.baseUrl, resource).pipe(
      map(response => this.assembler.toEntityFromResponse(response))
    );
  }

  /**
   * Updates an existing user.
   * @param id - The user ID.
   * @param user - The updated user data.
   * @returns Observable of User entity.
   */
  updateUser(id: string, user: User): Observable<User> {
    const resource = this.assembler.toResourceFromEntity(user);
    return this.http.put<UserResponse>(`${this.baseUrl}/${id}`, resource).pipe(
      map(response => this.assembler.toEntityFromResponse(response))
    );
  }

  /**
   * Deletes a user.
   * @param id - The user ID.
   * @returns Observable of boolean indicating success.
   */
  deleteUser(id: string): Observable<boolean> {
    return this.http.delete<{ success: boolean }>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.success)
    );
  }
}
