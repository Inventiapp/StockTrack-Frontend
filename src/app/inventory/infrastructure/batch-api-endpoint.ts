import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Batch} from '../domain/model/batch.entity';
import {BatchResource, BatchResponse} from './batch-response';
import {BatchAssembler} from './batch-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export class BatchApiEndpoint extends BaseApiEndpoint<Batch, BatchResource, BatchResponse, BatchAssembler> {
  constructor(http: HttpClient) {
    // Use backend API URL if available, otherwise fallback to platform provider API
    const baseUrl = (environment as any).platformBackendApiBaseUrl || environment.platformProviderApiBaseUrl;
    const endpointPath = baseUrl.includes('/api/v1') ? '/batches' : '/batches';
    super(http, `${baseUrl}${endpointPath}`, new BatchAssembler());
  }
}

