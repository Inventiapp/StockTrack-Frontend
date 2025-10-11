import { BaseResource } from '../../shared/infrastructure/base-response';

/**
 * DTOs for user API responses and resources.
 * @remarks
 * This file defines the data transfer objects for user-related API communications.
 */

/**
 * Resource DTO for user data.
 */
export interface UserResource extends BaseResource {
  name: string;
  role: string;
  email: string;
  password?: string;
  status: string;
}

/**
 * Response DTO for user API calls.
 */
export interface UserResponse {
  success: boolean;
  message: string;
  user: UserResource;
}

/**
 * Response DTO for user list API calls.
 */
export interface UserListResponse {
  success: boolean;
  message: string;
  users: UserResource[];
}
