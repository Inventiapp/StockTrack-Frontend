import {Component, EventEmitter, inject,OnInit,  Input, Output} from '@angular/core';
import {Kit, KitProduct} from '../../domain/model/kit.entity';
import {Product} from '../../domain/model/product.entity';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { StockApi } from '../../infrastructure/stock-api';
import { ProductsApi } from '../../infrastructure/products-api';
import { KitApi } from '../../infrastructure/kit-api';
import { forkJoin } from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';
interface NewKitItem {
  productId: string;
  name: string;
  currentStock: number;
  quantity: number;
  selected: boolean;
}

@Component({
  selector: 'app-new-kit-dialog',
    templateUrl: './new-kit-dialog.html',
  styleUrl: './new-kit-dialog.css',
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
  ]
})

export class NewKitDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<NewKitDialogComponent>);
  private productsApi = inject(ProductsApi);
  private stockApi = inject(StockApi);
  private kitApi = inject(KitApi);

  nombre: string = '';
  precio: number = 0;
  items: NewKitItem[] = [];
  loading: boolean = true;
  error: string = '';
  saving: boolean = false;

  loadProductsWithStock(): void {
    this.loading = true;
    this.error = '';

    // Cargar productos y stock en paralelo
    forkJoin({
      products: this.productsApi.getProducts(),
      stock: this.stockApi.getStock()
    }).subscribe({
      next: ({ products, stock }) => {
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
              selected: false  // Inicialmente ningún producto está seleccionado
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



  ngOnInit(): void {
    this.loadProductsWithStock();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // Validaciones
    if (!this.nombre.trim()) {
      this.error = 'El nombre del kit es obligatorio';
      return;
    }
    if (this.precio <= 0) {
      this.error = 'El precio debe ser mayor a 0';
      return;
    }
    const itemsToSave = this.items.filter(item => item.selected && item.quantity > 0);

    if (itemsToSave.length === 0) {
      this.error = 'Debe seleccionar al menos un producto para el kit';
      return;
    }

    // Limpiar error
    this.error = '';
    this.saving = true;

    // Crear el kit con los productos seleccionados
    const kitProducts: KitProduct[] = itemsToSave.map(item => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity
    }));

    const newKit = new Kit({
      id: '', // El ID será generado por el backend
      name: this.nombre,
      price: this.precio,
      isEnabled: true,
      products: kitProducts
    });

    // Enviar al backend
    this.kitApi.createKit(newKit).subscribe({
      next: (createdKit) => {
        console.log('Kit creado exitosamente:', createdKit);
        this.saving = false;
        this.dialogRef.close(createdKit);
      },
      error: (error: any) => {
        console.error('Error al crear el kit:', error);
        this.error = 'Error al guardar el kit. Por favor intente nuevamente.';
        this.saving = false;
      }
    });
  }

  toggleSelection(item: NewKitItem): void {
    item.selected = !item.selected;
    if (!item.selected) {
      item.quantity = 0;
    }
  }

  incrementQuantity(item: NewKitItem): void {
    // Solo permitir incrementar si el item está seleccionado
    if (!item.selected) {
      item.selected = true;
    }
    item.quantity++;
  }

  decrementQuantity(item: NewKitItem): void {
    if (item.quantity > 0) {
      item.quantity--;
      // Si la cantidad llega a 0, deseleccionar automáticamente
      if (item.quantity === 0) {
        item.selected = false;
      }
    }
  }

}

