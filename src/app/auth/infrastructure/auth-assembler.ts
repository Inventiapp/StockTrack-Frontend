import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { User } from '../domain/model/user.entity';
import { UserResource, LoginResponse, RegisterResponse } from './auth-response';

/**
 * Assembler for transforming between User entities and UserResource DTOs.
 * @remarks
 * This class handles the conversion between domain entities and API resources.
 */
export class AuthAssembler implements BaseAssembler<User, UserResource, LoginResponse> {
  /**
   * Converts a UserResource DTO to a User entity.
   * @param resource - The user resource from the API.
   * @returns A User entity instance.
   */
  toEntityFromResource(resource: UserResource): User {
    return new User({
      id: resource.id,
      email: resource.email,
      name: resource.name,
      role: resource.role,
      token: resource.token
    });
  }

  /**
   * Converts a User entity to a UserResource DTO.
   * @param entity - The user entity.
   * @returns A UserResource DTO.
   */
  toResourceFromEntity(entity: User): UserResource {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      role: entity.role,
      token: entity.token
    };
  }

  /**
   * Converts multiple UserResource DTOs to User entities.
   * @param resources - Array of user resources from the API.
   * @returns Array of User entity instances.
   */
  toEntitiesFromResources(resources: UserResource[]): User[] {
    return resources.map(resource => this.toEntityFromResource(resource));
  }

  /**
   * Converts multiple User entities to UserResource DTOs.
   * @param entities - Array of user entities.
   * @returns Array of UserResource DTOs.
   */
  toResourcesFromEntities(entities: User[]): UserResource[] {
    return entities.map(entity => this.toResourceFromEntity(entity));
  }

  /**
   * Converts a response with multiple resources to User entities.
   * @param response - The response containing user resources.
   * @returns Array of User entity instances.
   */
  toEntitiesFromResponse(response: LoginResponse): User[] {
    return [this.toEntityFromResource(response.user)];
  }
}

