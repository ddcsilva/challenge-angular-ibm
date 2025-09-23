  import { Injectable, computed, signal, inject } from '@angular/core';
  import {
    CharacterService,
    Character,
    CharacterApiResponse,
    CharacterFilters,
    CharacterForm,
  } from '@features/characters';
  import { CharacterLocalStorageService } from './character-local-storage.service';

  @Injectable()
  export class CharacterStore {
    readonly characterService = inject(CharacterService);
    private localStorageService = inject(CharacterLocalStorageService);
    private _searchTerm = signal<string>('');
    readonly searchTerm = this._searchTerm.asReadonly();

    // Signals para o estado da store
    private _characters = signal<Character[]>([]);
    private _localCharacters = signal<Character[]>([]);
    private _loading = signal(false);
    private _error = signal<string | null>(null);
    private _currentPage = signal(1);
    private _totalPages = signal(0);

    // Signals públicos (readonly) para acesso externo
    readonly characters = this._characters.asReadonly();
    readonly localCharacters = this._localCharacters.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();
    readonly currentPage = this._currentPage.asReadonly();
    readonly totalPages = this._totalPages.asReadonly();

    // Computed signals para cálculos complexos
    readonly allCharacters = computed(() => [...this.localCharacters(), ...this.characters()]);
    readonly hasCharacters = computed(() => this.allCharacters().length > 0);
    readonly hasNextPage = computed(() => this.currentPage() < this.totalPages());
    readonly hasPrevPage = computed(() => this.currentPage() > 1);
    readonly localCharactersCount = computed(() => this.localCharacters().length);

    /**
     * Carrega personagens com filtros
     * @param filters - Filtros opcionais para a busca
     * @returns void
     */
    loadCharacters(filters?: CharacterFilters) {
      this._loading.set(true);
      this._error.set(null);

      this.loadLocalCharacters();

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
     * @param searchTerm - Termo de busca
     */
    searchCharacters(searchTerm: string) {
      this._searchTerm.set(searchTerm);
      this._currentPage.set(1);
      this._error.set(null);
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

    /**
     * Carrega personagens locais do localStorage
     */
    loadLocalCharacters() {
      try {
        const localChars = this.localStorageService.getLocalCharacters();
        this._localCharacters.set(localChars);
      } catch (error) {
        console.error('Erro ao carregar personagens locais:', error);
      }
    }

    /**
     * Cria um novo personagem local
     * @param characterForm - Formulário do personagem
     * @returns Personagem criado
     */
    createCharacter(characterForm: CharacterForm): Character {
      try {
        const newCharacter = this.localStorageService.saveCharacter(characterForm);
        this._localCharacters.update(chars => [newCharacter, ...chars]);
        return newCharacter;
      } catch (error) {
        console.error('Erro ao criar personagem:', error);
        throw error;
      }
    }

    /**
     * Atualiza um personagem existente
     * @param id - ID do personagem
     * @param characterForm - Formulário do personagem
     * @returns Personagem atualizado
     */
    updateCharacter(id: number, characterForm: CharacterForm): Character {
      try {
        const updatedCharacter = this.localStorageService.updateCharacter(id, characterForm);
        if (!updatedCharacter) {
          throw new Error('Personagem não encontrado');
        }

        this._localCharacters.update(chars => chars.map(char => (char.id === id ? updatedCharacter : char)));

        return updatedCharacter;
      } catch (error) {
        console.error('Erro ao atualizar personagem:', error);
        throw error;
      }
    }

    /**
     * Remove um personagem
     * @param id - ID do personagem
     * @returns true se o personagem foi removido, false caso contrário
     */
    deleteCharacter(id: number): boolean {
      try {
        const success = this.localStorageService.deleteCharacter(id);
        if (success) {
          this._localCharacters.update(chars => chars.filter(char => char.id !== id));
        }
        return success;
      } catch (error) {
        console.error('Erro ao deletar personagem:', error);
        return false;
      }
    }

    /**
     * Busca um personagem por ID (local ou da API)
     * @param id - ID do personagem
     * @returns Personagem encontrado
     */
    getCharacterById(id: number): Character | null {
      const localCharacter = this.localStorageService.getLocalCharacterById(id);
      if (localCharacter) {
        return localCharacter;
      }

      const apiCharacters = this.characters();
      return apiCharacters.find(char => char.id === id) || null;
    }

    /**
     * Verifica se um personagem é local
     */
    isLocalCharacter(id: number): boolean {
      return this.localStorageService.isLocalCharacter(id);
    }

    /**
     * Filtra personagens locais por nome
     * @param searchTerm - Termo de busca
     * @returns Personagens filtrados
     */
    filterLocalCharacters(searchTerm: string): Character[] {
      if (!searchTerm) return this.localCharacters();

      return this.localCharacters().filter(char => char.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    /**
     * Obtém estatísticas dos personagens
     * @returns Estatísticas dos personagens
     */
    getCharacterStats() {
      const local = this.localCharacters();
      const api = this.characters();

      return {
        totalLocal: local.length,
        totalFromAPI: api.length,
        totalAll: local.length + api.length,
        aliveCount: [...local, ...api].filter(c => c.status === 'Alive').length,
        deadCount: [...local, ...api].filter(c => c.status === 'Dead').length,
        unknownCount: [...local, ...api].filter(c => c.status === 'unknown').length,
      };
    }

    /**
     * Limpa todos os dados locais (para desenvolvimento)
     */
    clearLocalData(): void {
      this.localStorageService.clearLocalCharacters();
      this._localCharacters.set([]);
    }
  }
