import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../domain/model/product.entity';
import { Category } from '../domain/model/category.entity';
import { Provider } from '../domain/model/provider.entity';
import { Kit } from '../domain/model/kit.entity';
import { Restocking } from '../domain/model/restocking.entity';
import { ProductsApi } from '../infrastructure/products-api';
import { CategoryApi } from '../infrastructure/category-api';
import { ProvidersApi } from '../../providers-management/infrastructure/providers-api';
import { StockApi } from '../infrastructure/stock-api';
import { StockResource } from '../infrastructure/stock-response';
import { KitApi } from '../infrastructure/kit-api';
import { RestockingApi } from '../infrastructure/restocking-api';

/**
 * Store for managing inventory state and operations.
 * @remarks
 * This service orchestrates inventory use cases and manages inventory state.
 */
@Injectable({
  providedIn: 'root'
})
export class InventoryStore {
  private readonly productsSignal = signal<Product[]>([]);
  private readonly categoriesSignal = signal<Category[]>([]);
  private readonly providersSignal = signal<Provider[]>([]);
  private readonly stockSignal = signal<StockResource[]>([]);
  private readonly kitsSignal = signal<Kit[]>([]);
  private readonly restockingsSignal = signal<Restocking[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly products = this.productsSignal.asReadonly();
  readonly categories = this.categoriesSignal.asReadonly();
  readonly providers = this.providersSignal.asReadonly();
  readonly stock = this.stockSignal.asReadonly();
  readonly kits = this.kitsSignal.asReadonly();
  readonly restockings = this.restockingsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly hasProducts = computed(() => this.products().length > 0);
  readonly hasCategories = computed(() => this.categories().length > 0);
  readonly hasProviders = computed(() => this.providers().length > 0);
  readonly hasStock = computed(() => this.stock().length > 0);
  readonly hasKits = computed(() => this.kits().length > 0);
  readonly hasRestockings = computed(() => this.restockings().length > 0);

  constructor(
    private productsApi: ProductsApi,
    private categoriesApi: CategoryApi,
    private providersApi: ProvidersApi,
    private stockApi: StockApi,
    private kitApi: KitApi,
    private restockingApi: RestockingApi
  ) {
    this.loadInventoryData();
  }

  private loadInventoryData(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.productsApi.getProducts().subscribe({
      next: (products: Product[]) => {
        this.productsSignal.set(products);
      },
      error: (err: any) => {
        this.errorSignal.set(this.formatError(err, 'Error loading products'));
      }
    });

    this.categoriesApi.getAll().subscribe({
      next: (categories: any[]) => {
        const categoryEntities = categories.map(cat => new Category({
          id: cat.id,
          name: cat.name
        }));
        this.categoriesSignal.set(categoryEntities);
      },
      error: (err: any) => {
        this.errorSignal.set(this.formatError(err, 'Error loading categories'));
      }
    });

    this.providersApi.getProviders().subscribe({
      next: (providers: Provider[]) => {
        this.providersSignal.set(providers);
      },
      error: (err: any) => {
        this.errorSignal.set(this.formatError(err, 'Error loading providers'));
      }
    });

    this.stockApi.getStock().subscribe({
      next: (stock: StockResource[]) => {
        this.stockSignal.set(stock);
      },
      error: (err: any) => {
        this.errorSignal.set(this.formatError(err, 'Error loading stock'));
      }
    });

    this.kitApi.getKits().subscribe({
      next: (kits: Kit[]) => {
        this.kitsSignal.set(kits);
      },
      error: (err: any) => {
        this.errorSignal.set(this.formatError(err, 'Error loading kits'));
      }
    });

    this.restockingApi.getRestockings().subscribe({
      next: (restockings: Restocking[]) => {
        this.restockingsSignal.set(restockings);
        this.loadingSignal.set(false);
      },
      error: (err: any) => {
        this.errorSignal.set(this.formatError(err, 'Error loading restockings'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Adds a new product to the store.
   * @param product - The product to add.
   */
  addProduct(product: Product): void {
    const currentProducts = this.productsSignal();
    this.productsSignal.set([...currentProducts, product]);
  }

  /**
   * Updates an existing product in the store.
   * @param product - The updated product.
   */
  updateProduct(product: Product): void {
    const currentProducts = this.productsSignal();
    const index = currentProducts.findIndex(p => p.id === product.id);
    if (index > -1) {
      const updatedProducts = [...currentProducts];
      updatedProducts[index] = product;
      this.productsSignal.set(updatedProducts);
    }
  }

  /**
   * Removes a product from the store.
   * @param productId - The ID of the product to remove.
   */
  removeProduct(productId: string): void {
    const currentProducts = this.productsSignal();
    this.productsSignal.set(currentProducts.filter(p => p.id !== productId));
  }

  /**
   * Adds a new category to the store.
   * @param category - The category to add.
   */
  addCategory(category: Category): void {
    const currentCategories = this.categoriesSignal();
    this.categoriesSignal.set([...currentCategories, category]);
  }

  /**
   * Updates an existing category in the store.
   * @param category - The updated category.
   */
  updateCategory(category: Category): void {
    const currentCategories = this.categoriesSignal();
    const index = currentCategories.findIndex(c => c.id === category.id);
    if (index > -1) {
      const updatedCategories = [...currentCategories];
      updatedCategories[index] = category;
      this.categoriesSignal.set(updatedCategories);
    }
  }

  /**
   * Removes a category from the store.
   * @param categoryId - The ID of the category to remove.
   */
  removeCategory(categoryId: string): void {
    const currentCategories = this.categoriesSignal();
    this.categoriesSignal.set(currentCategories.filter(c => c.id !== categoryId));
  }

  /**
   * Adds a new kit to the store.
   * @param kit - The kit to add.
   */
  addKit(kit: Kit): void {
    const currentKits = this.kitsSignal();
    this.kitsSignal.set([...currentKits, kit]);
  }

  /**
   * Updates an existing kit in the store.
   * @param kit - The updated kit.
   */
  updateKit(kit: Kit): void {
    const currentKits = this.kitsSignal();
    const index = currentKits.findIndex(k => k.id === kit.id);
    if (index > -1) {
      const updatedKits = [...currentKits];
      updatedKits[index] = kit;
      this.kitsSignal.set(updatedKits);
    }
  }

  /**
   * Removes a kit from the store.
   * @param kitId - The ID of the kit to remove.
   */
  removeKit(kitId: string): void {
    const currentKits = this.kitsSignal();
    this.kitsSignal.set(currentKits.filter(k => k.id !== kitId));
  }

  /**
   * Adds a new restocking to the store.
   * @param restocking - The restocking to add.
   */
  addRestocking(restocking: Restocking): void {
    this.restockingApi.createRestocking(restocking).subscribe({
      next: (createdRestocking: Restocking) => {
        this.restockingsSignal.update(restockings => [...restockings, createdRestocking]);
        
        // Actualizar el stock de los productos
        restocking.items.forEach(item => {
          this.stockApi.getStockByProductId(item.productId).subscribe({
            next: (stockResource) => {
              if (stockResource) {
                const newStock = stockResource.currentStock + item.quantityToAdd;
                this.stockApi.updateStock(stockResource.id, newStock).subscribe({
                  next: (updatedStock) => {
                    // Actualizar el stock en el signal
                    this.stockSignal.update(stocks => 
                      stocks.map(s => s.id === updatedStock.id ? updatedStock : s)
                    );
                  }
                });
              }
            }
          });
        });
      },
      error: (err: any) => {
        this.errorSignal.set(this.formatError(err, 'Error adding restocking'));
      }
    });
  }

  /**
   * Updates an existing restocking in the store.
   * @param restocking - The updated restocking.
   */
  updateRestocking(restocking: Restocking): void {
    const currentRestockings = this.restockingsSignal();
    const index = currentRestockings.findIndex(r => r.id === restocking.id);
    if (index > -1) {
      const updatedRestockings = [...currentRestockings];
      updatedRestockings[index] = restocking;
      this.restockingsSignal.set(updatedRestockings);
    }
  }

  /**
   * Removes a restocking from the store.
   * @param restockingId - The ID of the restocking to remove.
   */
  removeRestocking(restockingId: string): void {
    const currentRestockings = this.restockingsSignal();
    this.restockingsSignal.set(currentRestockings.filter(r => r.id !== restockingId));
  }

  /**
   * Refreshes inventory data.
   */
  refresh(): void {
    this.loadInventoryData();
  }

  /**
   * Formats error messages for better user experience.
   * @param error - The error object.
   * @param fallback - The fallback message if error is not an Error instance.
   * @returns A formatted error message.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
