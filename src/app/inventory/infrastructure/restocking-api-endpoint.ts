import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Restocking} from '../domain/model/restocking.entity';
import {RestockingResource, RestockingResponse} from './restocking-response';
import {RestockingAssembler} from './restocking-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export class RestockingApiEndpoint extends BaseApiEndpoint<Restocking, RestockingResource, RestockingResponse, RestockingAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderRestockingEndpointPath}`, new RestockingAssembler());
  }
}
