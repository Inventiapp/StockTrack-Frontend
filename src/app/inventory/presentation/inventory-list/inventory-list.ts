import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { RestockingDialogComponent } from '../restocking-dialog/restocking-dialog';
import { NewKitDialogComponent } from '../new-kit-dialog/new-kit-dialog';
import { KitApi } from '../../infrastructure/kit-api';
import { Kit } from '../../domain/model/kit.entity';
import { Product } from '../../domain/model/product.entity';
import { forkJoin } from 'rxjs';
import { ProductsApi } from '../../infrastructure/products-api';
import { StockApi } from '../../infrastructure/stock-api';
import { ProductInfoDialogComponent, ProductInfoData } from '../product-info-dialog/product-info-dialog';
import { CategoryApi } from '../../infrastructure/category-api';
import { RestockingApi } from '../../infrastructure/restocking-api';
import { Restocking } from '../../domain/model/restocking.entity';
import { RestockingItem } from '../../domain/model/restocking-item.entity';
import {NewProductDialogComponent} from '../new-product-dialog/new-product-dialog';

type ProductRow = {
  id: string,
  name: string,
  unitPrice: number,
  minStock: number,
  currentStock: number,
  categoryName?: string;
  providerName?: string;
  lastReception?: string;  // ISO 'YYYY-MM-DD'
  lot?: string;
  expirationDate?: string;
};

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.html',
  styleUrls: ['./inventory-list.css'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class InventoryListComponent implements OnInit {
  private translate = inject(TranslateService);
  private dialog = inject(MatDialog);
  private kitApi = inject(KitApi);
  private productsApi = inject(ProductsApi);
  private stockApi = inject(StockApi);
  private categoriesApi = inject(CategoryApi);
  private restockingApi = inject(RestockingApi);

  kits: Kit[] = [];
  loading: boolean = true;
  error: string = '';
  productsRow: ProductRow[] = [];

  ngOnInit(): void {
    this.loadKits();
    this.loadProducts();
  }

  protected t(key: string): string {
    return this.translate.instant(key);
  }

  loadKits(): void {
    this.loading = true;
    this.error = '';

    this.kitApi.getKits().subscribe({
      next: (kits) => {
        this.kits = kits.filter(k => k.isEnabled);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar kits:', error);
        this.error = 'Error al cargar los kits';
        this.loading = false;
      }
    });
  }

  openRestockingDialog(): void {
    const dialogRef = this.dialog.open(RestockingDialogComponent, {
      width: '750px',
      maxWidth: '90vw',
      panelClass: 'restocking-dialog',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Datos de reposición:', result);
        this.saveRestocking(result);
      }
    });
  }

  private saveRestocking(data: any): void {
    // Crear el ID único para la reposición
    const restockingId = this.generateId();

    // Transformar items del diálogo a RestockingItem entidades
    const restockingItems = data.items.map((item: any) =>
      new RestockingItem({
        productId: item.productId,
        quantityToAdd: item.quantity
      })
    );

    // Crear la entidad Restocking
    const restocking = new Restocking({
      id: restockingId,
      lot: data.lote,
      receptionDate: data.fechaRecepcion,
      expirationDate: data.fechaVencimiento,
      items: restockingItems
    });

    // Guardar la reposición y actualizar el stock
    this.restockingApi.createRestocking(restocking).subscribe({
      next: (savedRestocking) => {
        console.log('Reposición creada:', savedRestocking);
        // Actualizar el stock de cada producto
        this.updateStockForProducts(data.items);
      },
      error: (error: any) => {
        console.error('Error al crear reposición:', error);
        this.error = 'Error al guardar la reposición';
      }
    });
  }

  private updateStockForProducts(items: any[]): void {
    // Crear array de observables para actualizar el stock
    const updateObservables = items.map(item => {
      // Obtener el stock actual del producto
      return this.stockApi.getStockByProductId(item.productId);
    });

    // Ejecutar todas las consultas en paralelo
    forkJoin(updateObservables).subscribe({
      next: (stockResources) => {
        // Actualizar cada stock con la nueva cantidad
        const updates = items.map((item, index) => {
          const stockResource = stockResources[index];
          if (stockResource) {
            const newStock = stockResource.currentStock + item.quantity;
            return this.stockApi.updateStock(stockResource.id, newStock);
          }
          return null;
        }).filter(obs => obs !== null);

        // Ejecutar todas las actualizaciones
        if (updates.length > 0) {
          forkJoin(updates).subscribe({
            next: () => {
              console.log('Stock actualizado correctamente');
            },
            error: (error: any) => {
              console.error('Error al actualizar stock:', error);
              this.error = 'Error al actualizar el stock';
            }
          });
        }
      },
      error: (error: any) => {
        console.error('Error al obtener stock:', error);
        this.error = 'Error al obtener el stock actual';
      }
    });
  }

  private generateId(): string {
    // Generar un ID único simple
    return Math.random().toString(36).substring(2, 11);
  }


  openNewKitDialog(): void {
    const dialogRef = this.dialog.open(NewKitDialogComponent, {
      width: '750px',
      maxWidth: '90vw',
      panelClass: 'new-kit-dialog',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Kit creado exitosamente:', result);
        // Recargar los kits para mostrar el nuevo
        this.loadKits();
      }
    });
  }

  // Calcula el total del kit sumando los productos
  calculateKitTotal(kit: Kit): number {
    return kit.products.reduce((sum, product) => sum + product.quantity, 0);
  }


  /* PRODUCTOS */

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      products: this.productsApi.getProducts(), // Product[]
      stock: this.stockApi.getStock(),           // StockResource[]
      categories: this.categoriesApi.getAll(),     // CategoryResource[]
      restockings: this.restockingApi.getRestockings() // [{lot,receptionDate,expirationDate,items:[{productId,...}]}]
    }).subscribe({
      next: ({ products, stock, categories, restockings }) => {
        const stockByProduct = new Map(stock.map(s => [s.productId, s.currentStock]));
        const categoryMap = new Map(categories.map(c => [c.id, c.name]));
        const latestByProduct = new Map<string, { lot: string; receptionDate: string; expirationDate: string }>();
        for (const r of restockings) {
          const recDate = new Date(r.receptionDate);
          for (const it of r.items) {
            const prev = latestByProduct.get(it.productId);
            if (!prev || recDate > new Date(prev.receptionDate)) {
              latestByProduct.set(it.productId, {
                lot: r.lot,
                receptionDate: r.receptionDate,
                expirationDate: r.expirationDate
              });
            }
          }
        }
        this.productsRow = products.map(p => ({
          id: p.id,
          name: p.name,
          unitPrice: p.unitPrice,
          minStock: p.minStock,
          currentStock: stockByProduct.get(p.id) ?? 0,
          categoryName: categoryMap.get(p.categoryId) ?? '-',
          lot: latestByProduct.get(p.id)?.lot ?? '-',                       // ⬅️ lote
          lastReception: latestByProduct.get(p.id)?.receptionDate ?? undefined,
          expirationDate: latestByProduct.get(p.id)?.expirationDate ?? undefined
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        this.error = 'Error al cargar los productos';
        this.loading = false;
      }
    });
  }

  trackByProductId(_: number, p: ProductRow) { return p.id; }

  openProductInfo(p: ProductRow) {
    const data: ProductInfoData = {
      title: p.name,
      category: p.categoryName,
      currentStock: p.currentStock,
      minStock: p.minStock,
      unitPrice: p.unitPrice,
      lastReception: p.lastReception,
      lot: p.lot,
      provider: p.providerName,
      expirationDate: p.expirationDate
    };

    this.dialog.open(ProductInfoDialogComponent, {
      width: '520px',
      maxWidth: '90vw',
      panelClass: 'product-info-dialog',
      data
    });
  }

  /* NUEVO PRODUCTO */

  openNewProductDialog(): void {
    const dialogRef = this.dialog.open(NewProductDialogComponent, {
      width: '750px',
      maxWidth: '90vw',
      panelClass: 'new-product-dialog',
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(ok => { if (ok) this.loadProducts(); });
  }
}

