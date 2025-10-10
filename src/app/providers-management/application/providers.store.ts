import { Injectable, signal, computed } from '@angular/core';
import { Provider } from '../../inventory/domain/model/provider.entity';
import { ProvidersApi } from '../infrastructure/providers-api';

/**
 * Store for managing providers state and operations.
 * @remarks
 * This service orchestrates provider use cases and manages provider state.
 */
@Injectable({
  providedIn: 'root'
})
export class ProvidersStore {
  private readonly providersSignal = signal<Provider[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly providers = this.providersSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly hasProviders = computed(() => this.providers().length > 0);

  constructor(private providersApi: ProvidersApi) {
    this.loadProviders();
  }

  private loadProviders(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.providersApi.getProviders().subscribe({
      next: (providers) => {
        this.providersSignal.set(providers);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set('Error loading providers');
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Adds a new provider to the store.
   * @param provider - The provider to add.
   */
  addProvider(provider: Provider): void {
    const currentProviders = this.providersSignal();
    this.providersSignal.set([...currentProviders, provider]);
  }

  /**
   * Updates an existing provider in the store.
   * @param provider - The updated provider.
   */
  updateProvider(provider: Provider): void {
    const currentProviders = this.providersSignal();
    const index = currentProviders.findIndex(p => p.id === provider.id);
    if (index > -1) {
      const updatedProviders = [...currentProviders];
      updatedProviders[index] = provider;
      this.providersSignal.set(updatedProviders);
    }
  }

  /**
   * Removes a provider from the store.
   * @param providerId - The ID of the provider to remove.
   */
  removeProvider(providerId: string): void {
    const currentProviders = this.providersSignal();
    this.providersSignal.set(currentProviders.filter(p => p.id !== providerId));
  }

  /**
   * Refreshes providers data.
   */
  refresh(): void {
    this.loadProviders();
  }
}
