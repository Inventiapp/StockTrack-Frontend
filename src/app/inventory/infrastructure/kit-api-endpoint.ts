import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Kit} from '../domain/model/kit.entity';
import {KitResource, KitResponse} from './kit-response';
import {KitAssembler} from './kit-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export class KitApiEndpoint extends BaseApiEndpoint<Kit, KitResource, KitResponse, KitAssembler> {
  constructor(http: HttpClient) {
    // Usar el backend API base URL para kits
    super(http, `${environment.platformBackendApiBaseUrl}${environment.platformProviderKitsEndpointPath}`, new KitAssembler());
  }
}

