import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { RestockingDialogComponent } from '../restocking-dialog/restocking-dialog';
import { NewKitDialogComponent } from '../new-kit-dialog/new-kit-dialog';
import { KitApi } from '../../infrastructure/kit-api';
import { Kit } from '../../domain/model/kit.entity';
import { RestockingApi } from '../../infrastructure/restocking-api';
import { StockApi } from '../../infrastructure/stock-api';
import { Restocking } from '../../domain/model/restocking.entity';
import { RestockingItem } from '../../domain/model/restocking-item.entity';
import { forkJoin } from 'rxjs';

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
  private restockingApi = inject(RestockingApi);
  private stockApi = inject(StockApi);

  kits: Kit[] = [];
  loading: boolean = true;
  error: string = '';

  ngOnInit(): void {
    this.loadKits();
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
}

