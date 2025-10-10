import { TestBed } from '@angular/core/testing';
import { RestockingApi } from './restocking-api';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RestockingApi', () => {
  let service: RestockingApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RestockingApi]
    });
    service = TestBed.inject(RestockingApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
