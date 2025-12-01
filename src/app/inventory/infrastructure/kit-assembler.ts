import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Kit, KitProduct} from '../domain/model/kit.entity';
import {KitResource, KitResponse, KitProductResource} from './kit-response';

export class KitAssembler implements BaseAssembler<Kit, KitResource, KitResponse> {

  toEntityFromResource(resource: KitResource): Kit {
    // El backend puede devolver 'items' o 'products'
    const items = resource.items || resource.products || [];
    return new Kit({
      id: String(resource.id || ''),
      name: resource.name,
      price: resource.price || 0,
      isEnabled: resource.isEnabled !== undefined ? resource.isEnabled : true,
      products: items.map(p => ({
        productId: String(p.productId),
        name: '', // El backend no devuelve el nombre en items, se puede obtener después
        quantity: p.quantity,
        price: p.price || 0
      } as KitProduct))
    });
  }

  toEntitiesFromResponse(response: KitResponse): Kit[] {
    // El backend devuelve un array directo de kits
    if (Array.isArray(response)) {
      return (response as KitResource[]).map(kit => this.toEntityFromResource(kit));
    }
    // O puede devolver un objeto con 'kits'
    if (response.kits) {
      return response.kits.map(kit => this.toEntityFromResource(kit as KitResource));
    }
    return [];
  }

  toResourceFromEntity(entity: Kit): KitResource {
    // Para crear/actualizar, el backend espera solo 'name' e 'items' (sin id, price global, isEnabled)
    return {
      name: entity.name,
      items: entity.products?.map(p => ({
        productId: Number(p.productId), // El backend espera number
        quantity: p.quantity,
        price: p.price || 0
      } as KitProductResource)) || []
    } as KitResource;
  }
}

