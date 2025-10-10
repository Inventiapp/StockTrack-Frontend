import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Restocking} from '../domain/model/restocking.entity';
import {RestockingItem} from '../domain/model/restocking-item.entity';
import {RestockingResource, RestockingResponse, RestockingItemResource} from './restocking-response';

export class RestockingAssembler implements BaseAssembler<Restocking, RestockingResource, RestockingResponse> {

  toEntityFromResource(resource: RestockingResource): Restocking {
    const items = resource.items.map(itemResource =>
      new RestockingItem({
        productId: itemResource.productId,
        quantityToAdd: itemResource.quantityToAdd
      })
    );

    return new Restocking({
      id: resource.id,
      lot: resource.lot,
      receptionDate: resource.receptionDate,
      expirationDate: resource.expirationDate,
      items: items
    });
  }

  toEntitiesFromResponse(response: RestockingResponse): Restocking[] {
    return response.restockings.map(restocking => this.toEntityFromResource(restocking as RestockingResource));
  }

  toResourceFromEntity(entity: Restocking): RestockingResource {
    const itemResources: RestockingItemResource[] = entity.items.map(item => ({
      productId: item.productId,
      quantityToAdd: item.quantityToAdd
    }));

    return {
      id: entity.id,
      lot: entity.lot,
      receptionDate: entity.receptionDate,
      expirationDate: entity.expirationDate,
      items: itemResources
    } as RestockingResource;
  }
}
