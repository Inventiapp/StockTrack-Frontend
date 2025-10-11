import { Injectable } from '@angular/core';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { User, UserRole, UserStatus } from '../domain/user.model';
import { UserResource, UserResponse, UserListResponse } from './user-response';

/**
 * Assembler for transforming between User entities and UserResource DTOs.
 * @remarks
 * This service handles the conversion between domain entities and API resources.
 */
@Injectable({
  providedIn: 'root'
})
export class UserAssembler implements BaseAssembler<User, UserResource, UserResponse> {
  /**
   * Converts a UserResource to a User entity.
   * @param resource - The UserResource to convert.
   * @returns A User entity.
   */
  toEntityFromResource(resource: UserResource): User {
    return new User({
      id: String(resource.id || ''),
      name: resource.name,
      role: this.mapStringToUserRole(resource.role),
      email: resource.email,
      password: resource.password || '',
      status: this.mapStringToUserStatus(resource.status)
    });
  }

  /**
   * Converts a User entity to a UserResource.
   * @param entity - The User entity to convert.
   * @returns A UserResource.
   */
  toResourceFromEntity(entity: User): UserResource {
    const resource: UserResource = {
      name: entity.name,
      role: this.mapUserRoleToString(entity.role),
      email: entity.email,
      status: this.mapUserStatusToString(entity.status)
    };

    if (entity.id && entity.id.trim() !== '') {
      resource.id = entity.id;
    }

    if (entity.password && entity.password.trim() !== '') {
      resource.password = entity.password;
    }

    return resource;
  }

  /**
   * Converts an array of UserResources to User entities.
   * @param resources - The UserResource array to convert.
   * @returns An array of User entities.
   */
  toEntitiesFromResources(resources: UserResource[]): User[] {
    return resources.map(resource => this.toEntityFromResource(resource));
  }

  /**
   * Converts an array of User entities to UserResources.
   * @param entities - The User array to convert.
   * @returns An array of UserResources.
   */
  toResourcesFromEntities(entities: User[]): UserResource[] {
    return entities.map(entity => this.toResourceFromEntity(entity));
  }

  /**
   * Converts a UserResponse to a User entity.
   * @param response - The UserResponse to convert.
   * @returns A User entity.
   */
  toEntityFromResponse(response: UserResponse): User {
    return this.toEntityFromResource(response.user);
  }

  /**
   * Converts a UserResponse to User entities.
   * @param response - The UserResponse to convert.
   * @returns An array of User entities.
   */
  toEntitiesFromResponse(response: UserResponse): User[] {
    return [this.toEntityFromResponse(response)];
  }

  /**
   * Converts a UserListResponse to User entities.
   * @param response - The UserListResponse to convert.
   * @returns An array of User entities.
   */
  toEntitiesFromListResponse(response: UserListResponse): User[] {
    return this.toEntitiesFromResources(response.users);
  }

  /**
   * Maps a string role to UserRole enum.
   * @param roleString - The role string to map.
   * @returns The corresponding UserRole enum value.
   */
  private mapStringToUserRole(roleString: string): UserRole {
    switch (roleString.toLowerCase()) {
      case 'administrador':
        return UserRole.ADMIN;
      case 'vendedor':
        return UserRole.VENDOR;
      default:
        throw new Error(`Unknown user role: ${roleString}`);
    }
  }

  /**
   * Maps a string status to UserStatus enum.
   * @param statusString - The status string to map.
   * @returns The corresponding UserStatus enum value.
   */
  private mapStringToUserStatus(statusString: string): UserStatus {
    switch (statusString.toLowerCase()) {
      case 'activo':
        return UserStatus.ACTIVE;
      case 'inactivo':
        return UserStatus.INACTIVE;
      default:
        throw new Error(`Unknown user status: ${statusString}`);
    }
  }

  /**
   * Maps a UserRole enum to string.
   * @param role - The UserRole enum to map.
   * @returns The corresponding string value.
   */
  private mapUserRoleToString(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrador';
      case UserRole.VENDOR:
        return 'Vendedor';
      default:
        throw new Error(`Unknown user role: ${role}`);
    }
  }

  /**
   * Maps a UserStatus enum to string.
   * @param status - The UserStatus enum to map.
   * @returns The corresponding string value.
   */
  private mapUserStatusToString(status: UserStatus): string {
    switch (status) {
      case UserStatus.ACTIVE:
        return 'Activo';
      case UserStatus.INACTIVE:
        return 'Inactivo';
      default:
        throw new Error(`Unknown user status: ${status}`);
    }
  }
}
