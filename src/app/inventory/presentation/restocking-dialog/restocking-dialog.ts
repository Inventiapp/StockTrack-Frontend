import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ProductsApi } from '../../infrastructure/products-api';
import { StockApi } from '../../infrastructure/stock-api';
import { Product } from '../../domain/model/product.entity';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';

interface RestockingItem {
  productId: string;
  name: string;
  currentStock: number;
  quantity: number;
  total: number;
}

@Component({
  selector: 'app-restocking-dialog',
  templateUrl: './restocking-dialog.html',
  styleUrls: ['./restocking-dialog.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    MatProgressSpinnerModule,
    TranslatePipe
  ],
})
export class RestockingDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<RestockingDialogComponent>);
  private productsApi = inject(ProductsApi);
  private stockApi = inject(StockApi);

  lote: string = '';
  fechaRecepcion: string = '';
  fechaVencimiento: string = '';

  items: RestockingItem[] = [];
  loading: boolean = true;
  error: string = '';

  ngOnInit(): void {
    this.loadProductsWithStock();
  }

  loadProductsWithStock(): void {
    this.loading = true;
    this.error = '';

    // Cargar productos y stock en paralelo
    forkJoin({
      products: this.productsApi.getProducts(),
      stock: this.stockApi.getStock()
    }).subscribe({
      next: ({ products, stock }) => {
        // Crear mapa de stock por productId para búsqueda rápida
        const stockMap = new Map(stock.map(s => [s.productId, s.currentStock]));

        // Filtrar solo productos activos y mapear con stock real
        this.items = products
          .filter(p => p.isActive === true)
          .map(product => {
            const currentStock = stockMap.get(product.id) || 0;
            return {
              productId: product.id,
              name: product.name,
              currentStock: currentStock,
              quantity: 0,
              total: currentStock
            };
          });

        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar datos:', error);
        this.error = 'Error al cargar los productos y stock';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // Filtrar solo items con cantidad mayor a 0
    this.touched = true;
    if (!this.canSave) return;  // No permite guardar
    const itemsToSave = this.items.filter(item => item.quantity > 0);

    const data = {
      lote: this.lote,
      fechaRecepcion: this.fechaRecepcion,
      fechaVencimiento: this.fechaVencimiento,
      items: itemsToSave
    };
    this.dialogRef.close(data);
  }

  incrementQuantity(item: RestockingItem): void {
    item.quantity++;
    item.total = item.currentStock + item.quantity;
  }

  decrementQuantity(item: RestockingItem): void {
    if (item.quantity > 0) {
      item.quantity--;
      item.total = item.currentStock + item.quantity;
    }
  }

  updateTotal(item: RestockingItem): void {
    if (item.quantity < 0) {
      item.quantity = 0;
    }
    item.total = item.currentStock + item.quantity;
  }

  // Para mostrar errores cuando intenten guardar
  touched = false;

  // ---- Validaciones ----
  isValidDate(d: string): boolean {
    return !!d && !isNaN(Date.parse(d));
  }

  isExpirationBeforeReception(): boolean {
    if (!this.isValidDate(this.fechaRecepcion) || !this.isValidDate(this.fechaVencimiento)) return false;
    return new Date(this.fechaVencimiento) < new Date(this.fechaRecepcion);
  }

  get canSave(): boolean {
    const loteOk = this.lote.trim().length > 0;
    const recOk  = this.isValidDate(this.fechaRecepcion);
    const expOk  = this.isValidDate(this.fechaVencimiento);
    const orderOk = !this.isExpirationBeforeReception();
    return loteOk && recOk && expOk && orderOk;
  }

}
