import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { RestockingDialogComponent } from '../restocking-dialog/restocking-dialog';
import { NewKitDialogComponent } from '../new-kit-dialog/new-kit-dialog';
import { Kit } from '../../domain/model/kit.entity';
import { ProductInfoDialogComponent, ProductInfoData } from '../product-info-dialog/product-info-dialog';
import { Restocking } from '../../domain/model/restocking.entity';
import { RestockingItem } from '../../domain/model/restocking-item.entity';
import { NewProductDialogComponent } from '../new-product-dialog/new-product-dialog';
import { InventoryStore } from '../../application/inventory.store';

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
export class InventoryListComponent {
  protected readonly store = inject(InventoryStore);
  private translate = inject(TranslateService);
  private dialog = inject(MatDialog);

  // Getter reactivo que calcula productsRow directamente desde los signals del store
  get productsRow(): ProductRow[] {
    const stock = this.store.stock();
    const restockings = this.store.restockings();
    const products = this.store.products();
    const categories = this.store.categories();
    
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
    
    return products.map(p => ({
      id: p.id,
      name: p.name,
      unitPrice: p.unitPrice,
      minStock: p.minStock,
      currentStock: stockByProduct.get(p.id) ?? 0,
      categoryName: categoryMap.get(p.categoryId) ?? '-',
      lot: latestByProduct.get(p.id)?.lot ?? '-',
      lastReception: latestByProduct.get(p.id)?.receptionDate ?? undefined,
      expirationDate: latestByProduct.get(p.id)?.expirationDate ?? undefined
    }));
  }

  get kits(): Kit[] {
    return this.store.kits().filter(k => k.isEnabled);
  }

  protected t(key: string): string {
    return this.translate.instant(key);
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
    const restockingItems = data.items.map((item: any) =>
      new RestockingItem({
        productId: item.productId,
        quantityToAdd: item.quantity
      })
    );
    
    const restocking = new Restocking({
      id: '',
      lot: data.lote,
      receptionDate: data.fechaRecepcion,
      expirationDate: data.fechaVencimiento,
      items: restockingItems
    });

    // El store se encarga de crear el restocking
    // productsRow se actualiza automáticamente porque es un getter reactivo
    this.store.addRestocking(restocking);
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
        // Los kits se actualizan automáticamente en el store
      }
    });
  }

  calculateKitTotal(kit: Kit): number {
    return kit.products.reduce((sum, product) => sum + product.quantity, 0);
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

  openNewProductDialog(): void {
    const dialogRef = this.dialog.open(NewProductDialogComponent, {
      width: '750px',
      maxWidth: '90vw',
      panelClass: 'new-product-dialog',
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(ok => { 
      // productsRow se actualiza automáticamente porque es un getter reactivo
      if (ok) console.log('Producto creado exitosamente');
    });
  }
}

