import {Injectable, signal} from '@angular/core';
import {Sale} from '../domain/model/sale.entity';
import {Product} from '../../inventory/domain/model/product.entity';
import {Batch} from '../../inventory/domain/model/batch.entity';
import {ProductsApi} from '../../inventory/infrastructure/products-api';
import {BatchApi} from '../../inventory/infrastructure/batch-api';

@Injectable({
  providedIn: 'root'
})
export class SalesStore {
  private readonly SalesSignal = signal<Sale[]>([]);
  private readonly ProductsSignal = signal<Product[]>([]);
  private readonly batchesSignal = signal<Batch[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly sales = this.SalesSignal.asReadonly();
  readonly products = this.ProductsSignal.asReadonly();
  readonly batches = this.batchesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor(private productsApi: ProductsApi,
              private batchesApi: BatchApi,
  ) {

    this.loadProducts();
    this.loadBatches();
  }

  private loadProducts() {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.productsApi.getProducts().subscribe({
      next: (data: Product[]) => {
        this.ProductsSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: (err: Error) => {
        this.errorSignal.set(`Error loading products: ${err.message}`);
        this.loadingSignal.set(false);
      }
    });
  }

  private loadBatches() {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.batchesApi.getBatches().subscribe({
      next: (data: Batch[]) => {
        this.batchesSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: (err: Error) => {
        this.errorSignal.set(`Error loading batches: ${err.message}`);
        this.loadingSignal.set(false);
      }
    });
  }


}
