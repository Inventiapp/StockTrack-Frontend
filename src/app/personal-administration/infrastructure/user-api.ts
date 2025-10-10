import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../domain/user.model';
import { UserApiEndpoint } from './user-api-endpoint';

/**
 * API service for user operations.
 * @remarks
 * This service orchestrates user-related API calls using the UserApiEndpoint.
 */
@Injectable({
  providedIn: 'root'
})
export class UserApi {
  constructor(private endpoint: UserApiEndpoint) {}

  /**
   * Gets all users.
   * @returns Observable of User entities.
   */
  getAllUsers(): Observable<User[]> {
    return this.endpoint.getAllUsers();
  }

  /**
   * Gets a user by ID.
   * @param id - The user ID.
   * @returns Observable of User entity.
   */
  getUserById(id: string): Observable<User> {
    return this.endpoint.getUserById(id);
  }

  /**
   * Creates a new user.
   * @param user - The user data to create.
   * @returns Observable of User entity.
   */
  createUser(user: User): Observable<User> {
    return this.endpoint.createUser(user);
  }

  /**
   * Updates an existing user.
   * @param id - The user ID.
   * @param user - The updated user data.
   * @returns Observable of User entity.
   */
  updateUser(id: string, user: User): Observable<User> {
    return this.endpoint.updateUser(id, user);
  }

  /**
   * Deletes a user.
   * @param id - The user ID.
   * @returns Observable of boolean indicating success.
   */
  deleteUser(id: string): Observable<boolean> {
    return this.endpoint.deleteUser(id);
  }
}
