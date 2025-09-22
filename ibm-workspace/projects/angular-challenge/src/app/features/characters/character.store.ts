import { Injectable, computed, signal, inject } from '@angular/core';
import { CharacterService } from './character.service';
import { Character, CharacterApiResponse, CharacterFilters } from './character.model';

@Injectable()
export class CharacterStore {
  private characterService = inject(CharacterService);

  // Estado da store
  private _characters = signal<Character[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  private _currentPage = signal(1);
  private _totalPages = signal(0);

  // Signals públicos (readonly)
  readonly characters = this._characters.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly totalPages = this._totalPages.asReadonly();

  // Computed signals
  readonly hasCharacters = computed(() => this.characters().length > 0);
  readonly hasNextPage = computed(() => this.currentPage() < this.totalPages());
  readonly hasPrevPage = computed(() => this.currentPage() > 1);

  /**
   * Carrega personagens com filtros
   */
  loadCharacters(filters?: CharacterFilters) {
    this._loading.set(true);
    this._error.set(null);

    const searchFilters = { ...filters, page: this.currentPage() };

    this.characterService.getCharacters(searchFilters).subscribe({
      next: (response: CharacterApiResponse) => {
        this._characters.set(response.results);
        this._totalPages.set(response.info.pages);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Erro ao carregar personagens');
        this._loading.set(false);
      },
    });
  }

  /**
   * Vai para próxima página
   */
  nextPage() {
    if (this.hasNextPage()) {
      this._currentPage.update(page => page + 1);
    }
  }

  /**
   * Vai para página anterior
   */
  prevPage() {
    if (this.hasPrevPage()) {
      this._currentPage.update(page => page - 1);
    }
  }
}
