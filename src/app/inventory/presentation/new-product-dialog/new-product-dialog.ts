import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ProductsApi } from '../../infrastructure/products-api';
import { StockApi } from '../../infrastructure/stock-api';
import { InventoryStore } from '../../application/inventory.store';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-new-product-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, TranslatePipe],
  templateUrl: './new-product-dialog.html',
  styleUrls: ['./new-product-dialog.css'],
})
export class NewProductDialogComponent {
  protected readonly store = inject(InventoryStore);
  private dialogRef   = inject(MatDialogRef<NewProductDialogComponent>);
  private productsApi = inject(ProductsApi);
  private stockApi    = inject(StockApi);

  form = {
    name: '',
    categoryId: '',
    providerId: '',
    minStock: 0,
    unitPrice: '' as string | number
  };


  get isValid(): boolean {
    const price = Number(String(this.form.unitPrice).replace(',', '.'));
    return (
      this.form.name.trim().length > 0 &&
      !!this.form.categoryId &&
      !!this.form.providerId &&
      Number(this.form.minStock) >= 0 &&
      !isNaN(price) && price >= 0
    );
  }

  cancel() { this.dialogRef.close(false); }

  save() {
    const unitPrice = Number(String(this.form.unitPrice).replace(',', '.'));

    const product = {
      id: `prod-${Date.now()}`,
      name: this.form.name.trim(),
      description: '',
      categoryId: this.form.categoryId,
      providerId: String(this.form.providerId),
      minStock: Number(this.form.minStock),
      unitPrice,
      isActive: true
    };

    this.productsApi.createProduct(product).subscribe({
      next: (createdProduct) => {
        this.stockApi.createStock(product.id, 0).subscribe({
          next: () => {
            this.store.addProduct(createdProduct);
            this.dialogRef.close(true);
          },
          error: () => this.dialogRef.close(true)
        });
      },
      error: () => this.dialogRef.close(false)
    });
  }
}
