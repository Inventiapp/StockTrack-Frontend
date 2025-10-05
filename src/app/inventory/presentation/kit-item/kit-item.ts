import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Kit} from '../../domain/model/kit.entity';
import {Product} from '../../domain/model/product.entity';

@Component({
  selector: 'app-kit-item',
  imports: [],
  templateUrl: './kit-item.html',
  styleUrl: './kit-item.css'
})
export class KitItem {
  @Input() product!: Product;
  @Input() quantity: number = 1;
  @Output() remove = new EventEmitter<string>();
  @Output() editQuantity = new EventEmitter<{ id: string; quantity: number }>();
  onRemove(): void {
    this.remove.emit(this.product.id);
  }
  onQuantityChange(newQuantity: number): void {
    this.editQuantity.emit({ id: this.product.id, quantity: newQuantity });
  }
}
