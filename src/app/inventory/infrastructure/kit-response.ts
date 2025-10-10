import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface KitProductResource {
  productId: string;
  name: string;
  quantity: number;
}

export interface KitResource extends BaseResource {
  id: string;
  name: string;
  price: number;
  isEnabled: boolean;
  products: KitProductResource[];
}

export interface KitResponse extends BaseResponse {
  kits: KitResource[];
}

