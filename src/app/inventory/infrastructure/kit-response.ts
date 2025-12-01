import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface KitProductResource {
  productId: number | string;
  quantity: number;
  price: number;
}

export interface KitResource extends BaseResource {
  id?: number | string;
  name: string;
  price?: number;
  isEnabled?: boolean;
  items?: KitProductResource[]; // Para el request/response del backend
  products?: KitProductResource[]; // Para compatibilidad interna
}

export interface KitResponse extends BaseResponse {
  kits?: KitResource[];
}

