import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';


export interface ProviderResource extends BaseResource {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  ruc: string;
}


export interface ProviderResponse extends BaseResponse {
  providers: ProviderResource[];
}
