import { BaseResponse, BaseResource } from '../../shared/infrastructure/base-response';

/**
 * DTO for a user resource from the API.
 */
export interface UserResource extends BaseResource {
  id: string;
  email: string;
  name: string;
  role?: string;
  token?: string;
}

/**
 * DTO for login response from the API.
 */
export interface LoginResponse extends BaseResponse {
  user: UserResource;
  token: string;
}

/**
 * DTO for register response from the API.
 */
export interface RegisterResponse extends BaseResponse {
  user: UserResource;
  token: string;
}

