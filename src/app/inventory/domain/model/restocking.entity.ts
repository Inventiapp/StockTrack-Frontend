import { BaseEntity } from '../../../shared/infrastructure/base-entity';
import { RestockingItem } from './restocking-item.entity';

/**
 * Represents a Restocking operation.
 * Contains lot, reception/expiration dates, and the list of items to add.
 */
export class Restocking implements BaseEntity {
  /**
   * @param params - id, lot, receptionDate, expirationDate, items
   * Dates are strings to match UI/DTOs (e.g., '2025-09-12'); switch to Date if needed.
   */
  constructor(params: {
    id: string;
    lot: string;                  // e.g., "L-02"
    receptionDate: string;
    expirationDate: string;
    items: RestockingItem[];
  }) {
    this._id = params.id;
    this._lot = params.lot;
    this._receptionDate = params.receptionDate;
    this._expirationDate = params.expirationDate;
    this._items = params.items ?? [];
  }

  /** Unique identifier */
  private _id: string;
  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }

  /** Lot code */
  private _lot: string;
  get lot(): string { return this._lot; }
  set lot(value: string) { this._lot = value; }

  /** Reception date */
  private _receptionDate: string;
  get receptionDate(): string { return this._receptionDate; }
  set receptionDate(value: string) { this._receptionDate = value; }

  /** Expiration date*/
  private _expirationDate: string;
  get expirationDate(): string { return this._expirationDate; }
  set expirationDate(value: string) { this._expirationDate = value; }

  /** List of products with quantities to add */
  private _items: RestockingItem[];
  get items(): RestockingItem[] { return this._items; }
  set items(value: RestockingItem[]) { this._items = value ?? []; }

  /** Convenience: total units being added across all items */
  get totalQuantityToAdd(): number {
    return this._items.reduce((sum, item) => sum + (item.quantityToAdd || 0), 0);
  }

  /** Helpers (opcionales) */
  addItem(item: RestockingItem): void {
    this._items = [...this._items, item];
  }
  setItemQuantity(productId: string, quantityToAdd: number): void {
    this._items = this._items.map(i =>
      i.productId === productId ? new RestockingItem({ productId, quantityToAdd }) : i
    );
  }
  removeItem(productId: string): void {
    this._items = this._items.filter(i => i.productId !== productId);
  }
}
