import { TestBed } from '@angular/core/testing';
import { StockApi } from './stock-api';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StockApi', () => {
  let service: StockApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StockApi]
    });
    service = TestBed.inject(StockApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
