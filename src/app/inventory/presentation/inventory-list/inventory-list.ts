import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.html',
  styleUrls: ['./inventory-list.css'],
  standalone: true,
  imports: [CommonModule],
})
export class InventoryListComponent {
  title = 'Gestión de Inventario';
}

