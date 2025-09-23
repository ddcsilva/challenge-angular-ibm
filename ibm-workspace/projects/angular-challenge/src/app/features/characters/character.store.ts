import { Injectable, computed, signal, inject } from '@angular/core';
import { CharacterService, Character, CharacterApiResponse, CharacterFilters } from '@features/characters';

@Injectable()
export class CharacterStore {
  private characterService = inject(CharacterService);
  private _searchTerm = signal<string>('');
  readonly searchTerm = this._searchTerm.asReadonly();

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

    const currentSearch = this.searchTerm();
    const searchFilters = {
      ...filters,
      page: this.currentPage(),
      ...(currentSearch && { name: currentSearch }),
    };

    this.characterService.getCharacters(searchFilters).subscribe({
      next: (response: CharacterApiResponse) => {
        this._characters.set(response.results);
        this._totalPages.set(response.info.pages);
        this._loading.set(false);
      },
      error: error => {
        if (error.status === 404 && currentSearch) {
          this._characters.set([]);
          this._totalPages.set(0);
          this._error.set(null);
        } else {
          this._error.set('Erro ao carregar personagens');
          this._characters.set([]);
        }
        this._loading.set(false);
      },
    });
  }

  /**
   * Buscar personagens por nome
   */
  searchCharacters(searchTerm: string) {
    this._searchTerm.set(searchTerm);
    this._currentPage.set(1);
    this._error.set(null); // Limpa erro anterior
    this.loadCharacters({ name: searchTerm });
  }

  /**
   * Limpar busca
   */
  clearSearch() {
    this._searchTerm.set('');
    this._currentPage.set(1);
    this.loadCharacters();
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
