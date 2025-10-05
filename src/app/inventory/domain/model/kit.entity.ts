import {BaseEntity} from '../../../shared/infrastructure/base-entity';

/**
 * Represents a Kit entity int the application.
 * @remarks
 * This class is used as a domain model for kits in inventory
 * It implements the BaseEntity interface to ensure consistency across entities.
 * @see {@link BaseEntity}
 */
export class Kit implements BaseEntity {
  /**
   * Creates a new Kit instance.
   * @param kit - An object containing the id, name, price, isEnabled of the kit.
   * @returns A new instance of Kit.
   */
  constructor(kit: {
    id: string;
    name: string;
    price: number;
    isEnabled: boolean;
  }) {
    this._id = kit.id;
    this._name = kit.name;
    this._price = kit.price;
    this._isEnabled = kit.isEnabled;
  }

  /**
   * The unique identifier for the kit.
   */
  private _id: string;
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  /**
   * The name of the kit
   */
  private _name: string;
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  /**
   * The price of the kit
   */
  private _price: number;
  get price(): number {
    return this._price;
  }
  set price(value: number) {
    this._price = value;
  }

  private _isEnabled: boolean;
}
