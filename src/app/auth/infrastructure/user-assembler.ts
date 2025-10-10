import { User } from '../domain/model/user.entity';
import { UserResource } from './auth-response';

/**
 * Assembler for transforming between User entities and UserResource DTOs.
 * @remarks
 * This class handles the conversion between domain entities and API resources.
 */
export class UserAssembler {
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
}

