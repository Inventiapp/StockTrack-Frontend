import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { InventoryStore } from '../../application/inventory.store';

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
    MatDatepickerModule,
    FormsModule,
    MatProgressSpinnerModule,
    TranslatePipe
  ],
  providers: [provideNativeDateAdapter()]
})
export class RestockingDialogComponent implements OnInit {
  protected readonly store = inject(InventoryStore);
  private dialogRef = inject(MatDialogRef<RestockingDialogComponent>);

  lote: string = '';
  fechaRecepcion: Date | null = null;
  fechaVencimiento: Date | null = null;

  items: RestockingItem[] = [];

  get loading(): boolean {
    return this.store.loading();
  }

  get error(): string | null {
    return this.store.error();
  }

  ngOnInit(): void {
    this.loadProductsWithStock();
  }

  loadProductsWithStock(): void {
    const stockMap = new Map(this.store.stock().map(s => [s.productId, s.currentStock]));
    
    this.items = this.store.products()
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
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.touched = true;
    if (!this.canSave) return;
    const itemsToSave = this.items.filter(item => item.quantity > 0);

    const data = {
      lote: this.lote,
      fechaRecepcion: this.fechaRecepcion?.toISOString().split('T')[0] || '',
      fechaVencimiento: this.fechaVencimiento?.toISOString().split('T')[0] || '',
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

  touched = false;

  isValidDate(d: Date | null): boolean {
    return d !== null && d instanceof Date && !isNaN(d.getTime());
  }

  isExpirationBeforeReception(): boolean {
    if (!this.isValidDate(this.fechaRecepcion) || !this.isValidDate(this.fechaVencimiento)) return false;
    return this.fechaVencimiento! < this.fechaRecepcion!;
  }

  get canSave(): boolean {
    const loteOk = this.lote.trim().length > 0;
    const recOk  = this.isValidDate(this.fechaRecepcion);
    const expOk  = this.isValidDate(this.fechaVencimiento);
    const orderOk = !this.isExpirationBeforeReception();
    return loteOk && recOk && expOk && orderOk;
  }

}
