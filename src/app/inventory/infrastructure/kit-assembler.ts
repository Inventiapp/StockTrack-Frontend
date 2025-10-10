import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Kit, KitProduct} from '../domain/model/kit.entity';
import {KitResource, KitResponse, KitProductResource} from './kit-response';

export class KitAssembler implements BaseAssembler<Kit, KitResource, KitResponse> {

  toEntityFromResource(resource: KitResource): Kit {
    return new Kit({
      id: resource.id,
      name: resource.name,
      price: resource.price,
      isEnabled: resource.isEnabled,
      products: resource.products?.map(p => ({
        productId: p.productId,
        name: p.name,
        quantity: p.quantity
      } as KitProduct)) || []
    });
  }

  toEntitiesFromResponse(response: KitResponse): Kit[] {
    return response.kits.map(kit => this.toEntityFromResource(kit as KitResource));
  }

  toResourceFromEntity(entity: Kit): KitResource {
    return {
      id: entity.id,
      name: entity.name,
      price: entity.price,
      isEnabled: entity.isEnabled,
      products: entity.products?.map(p => ({
        productId: p.productId,
        name: p.name,
        quantity: p.quantity
      } as KitProductResource)) || []
    } as KitResource;
  }
}

