// typescript
import { Component, inject } from '@angular/core';
import { SalesStore } from '../../../application/sales.store';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

interface ViewProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
}

@Component({
  selector: 'app-sales-tables',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, TranslatePipe, MatFormField, MatInput],
  templateUrl: './sales-tables.html',
  styleUrls: ['./sales-tables.css']
})
export class SalesTables {
  private readonly store = inject(SalesStore);

  // Devuelve la lista de productos transformada para la vista (nombre, precio y stock calculado)
  get products(): ViewProduct[] {
    const products = this.store.products();
    const batches = this.store.batches();

    // Calcular stock por producto sumando las cantidades de los batches
    const stockByProduct = new Map<string, number>();
    for (const b of batches) {
      const current = stockByProduct.get(b.productId) ?? 0;
      stockByProduct.set(b.productId, current + (b.quantity ?? 0));
    }

    return products.map(p => ({
      id: p.id,
      name: p.name,
      price: (p.unitPrice ?? 0),
      stock: stockByProduct.get(p.id) ?? 0
    }));
  }

  kitDetails = [
    { qty: 1, name: 'Item A', price: 4.9 },
    { qty: 2, name: 'Item B', price: 2.45 }
  ];

  cartItems = [
    { name: 'Item A', unitPrice: 4.9, quantity: 1, total: 4.9 }
  ];

  get totalAmount(): number {
    return this.cartItems.reduce((s, i) => s + i.total, 0);
  }

  deleteItem(item: any) {
    // implementación mínima para mantener la plantilla funcional
    this.cartItems = this.cartItems.filter(i => i !== item);
  }

  cancelOrder() {
    this.cartItems = [];
  }

  saveOrder() {
    console.log('Guardar orden (no implementado)');
  }
}
