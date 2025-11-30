import { Component } from '@angular/core';
import {DecimalPipe, NgForOf} from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import {MatCard} from '@angular/material/card';
import {MatFormField} from '@angular/material/form-field';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';

interface Product {
  name: string;
  price: number;
  stock: number;
}

interface CartItem {
  name: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

interface KitItem {
  qty: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-sales-tables',
  templateUrl: './sales-tables.html',
  imports: [
    DecimalPipe,
    MatIcon,
    MatCard,
    MatFormField,
    NgForOf,
    MatIconButton,
    MatButton,
    MatInput
  ],
  styleUrls: ['./sales-tables.css']
})
export class SalesTables {

  // Datos simulados
  products: Product[] = [
    { name: 'Bolsa Papitas Lays Grande', price: 2.50, stock: 7 }
  ];

  cartItems: CartItem[] = [
    { name: 'Papel Toalla', unitPrice: 5.00, quantity: 2, total: 5.00 },
    { name: 'Combo Película - Inka Cola 1L', unitPrice: 6.00, quantity: 1, total: 6.00 },
    { name: 'Combo Película - Bolsa Papitas Lays Grande', unitPrice: 1.90, quantity: 2, total: 3.80 }
  ];

  kitDetails: KitItem[] = [
    { qty: 2, name: 'Bolsa Papitas Lays Grande', price: 3.8 },
    { qty: 1, name: 'Inca Cola 1L', price: 6.0 }
  ];

  get totalAmount(): number {
    return 14.80;
  }

  deleteItem(item: CartItem) {
    console.log('Eliminar item:', item.name);
  }

  saveOrder() {
    console.log('Guardar orden');
  }

  cancelOrder() {
    console.log('Cancelar');
  }
}
