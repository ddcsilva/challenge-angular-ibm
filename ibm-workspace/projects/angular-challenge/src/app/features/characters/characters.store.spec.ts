import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CharacterStore } from './character.store';
import { CharacterService } from './character.service';
import { CharacterLocalStorageService } from './character-local-storage.service';
import { Character, CharacterApiResponse, CharacterStatus, CharacterGender, CharacterForm } from './character.model';

describe('CharacterStore', () => {
  let store: CharacterStore;
  let mockCharacterService: jest.Mocked<CharacterService>;
  let mockLocalStorageService: jest.Mocked<CharacterLocalStorageService>;

  const mockApiCharacter: Character = {
    id: 1,
    name: 'Rick Sanchez',
    status: CharacterStatus.ALIVE,
    species: 'Human',
    type: '',
    gender: CharacterGender.MALE,
    origin: { name: 'Earth', url: '' },
    location: { name: 'Earth', url: '' },
    image: 'https://example.com/rick.jpg',
    episode: ['S01E01'],
    url: '',
    created: '2017-11-04T18:48:46.250Z',
  };

  const mockLocalCharacter: Character = {
    id: 10001,
    name: 'Morty Clone',
    status: CharacterStatus.ALIVE,
    species: 'Human',
    type: 'Clone',
    gender: CharacterGender.MALE,
    origin: { name: 'Local Creation', url: '' },
    location: { name: 'Local Storage', url: '' },
    image: 'https://ui-avatars.com/api/?name=Morty+Clone',
    episode: [],
    url: '',
    created: new Date().toISOString(),
  };

  const mockApiResponse: CharacterApiResponse = {
    info: {
      count: 826,
      pages: 42,
      next: 'https://rickandmortyapi.com/api/character/?page=2',
      prev: null,
    },
    results: [mockApiCharacter],
  };

  const mockCharacterForm: CharacterForm = {
    name: 'Test Character',
    status: CharacterStatus.ALIVE,
    species: 'Human',
    gender: CharacterGender.UNKNOWN,
    type: 'Test',
  };

  beforeEach(() => {
    const characterServiceSpy = {
      getCharacters: jest.fn(),
      getCharacterById: jest.fn(),
    };

    const localStorageServiceSpy = {
      getLocalCharacters: jest.fn(),
      saveCharacter: jest.fn(),
      updateCharacter: jest.fn(),
      deleteCharacter: jest.fn(),
      isLocalCharacter: jest.fn(),
      getLocalCharacterById: jest.fn(),
      getLocalCharactersCount: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        CharacterStore,
        { provide: CharacterService, useValue: characterServiceSpy },
        { provide: CharacterLocalStorageService, useValue: localStorageServiceSpy },
      ],
    });

    store = TestBed.inject(CharacterStore);
    mockCharacterService = TestBed.inject(CharacterService) as jest.Mocked<CharacterService>;
    mockLocalStorageService = TestBed.inject(CharacterLocalStorageService) as jest.Mocked<CharacterLocalStorageService>;

    mockLocalStorageService.getLocalCharacters.mockReturnValue([]);
  });

  describe('Inicialização', () => {
    it('deve inicializar com estado limpo', () => {
      expect(store.characters()).toEqual([]);
      expect(store.localCharacters()).toEqual([]);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
      expect(store.currentPage()).toBe(1);
      expect(store.totalPages()).toBe(0);
      expect(store.searchTerm()).toBe('');
    });

    it('deve ter computed signals funcionando corretamente', () => {
      mockLocalStorageService.getLocalCharacters.mockReturnValue([mockLocalCharacter]);

      store.loadLocalCharacters();

      expect(store.hasCharacters()).toBe(true);
      expect(store.localCharactersCount()).toBe(1);
      expect(store.allCharacters()).toEqual([mockLocalCharacter]);
    });
  });

  describe('loadCharacters()', () => {
    it('deve carregar personagens da API com sucesso', done => {
      mockCharacterService.getCharacters.mockReturnValue(of(mockApiResponse));
      mockLocalStorageService.getLocalCharacters.mockReturnValue([mockLocalCharacter]);

      store.loadCharacters();

      setTimeout(() => {
        expect(store.loading()).toBe(false);
        expect(store.characters()).toEqual([mockApiCharacter]);
        expect(store.localCharacters()).toEqual([mockLocalCharacter]);
        expect(store.totalPages()).toBe(42);
        expect(store.error()).toBeNull();
        expect(mockCharacterService.getCharacters).toHaveBeenCalledWith({
          page: 1,
        });
        done();
      }, 0);
    });

    it('deve tratar erro 404 em busca como resultado válido', done => {
      const error404 = { status: 404 };
      mockCharacterService.getCharacters.mockReturnValue(throwError(() => error404));
      store['_searchTerm'].set('PersonagemInexistente');

      store.loadCharacters();

      setTimeout(() => {
        expect(store.loading()).toBe(false);
        expect(store.characters()).toEqual([]);
        expect(store.totalPages()).toBe(0);
        expect(store.error()).toBeNull();
        done();
      }, 0);
    });

    it('deve tratar outros erros corretamente', done => {
      const networkError = { status: 500, message: 'Network error' };
      mockCharacterService.getCharacters.mockReturnValue(throwError(() => networkError));

      store.loadCharacters();

      setTimeout(() => {
        expect(store.loading()).toBe(false);
        expect(store.characters()).toEqual([]);
        expect(store.error()).toBe('Erro ao carregar personagens');
        done();
      }, 0);
    });
  });

  describe('searchCharacters()', () => {
    it('deve configurar busca e resetar paginação', done => {
      store['_currentPage'].set(5);
      mockCharacterService.getCharacters.mockReturnValue(of(mockApiResponse));

      store.searchCharacters('Rick');

      expect(store.searchTerm()).toBe('Rick');
      expect(store.currentPage()).toBe(1);
      expect(store.error()).toBeNull();

      setTimeout(() => {
        expect(mockCharacterService.getCharacters).toHaveBeenCalledWith({
          page: 1,
          name: 'Rick',
        });
        done();
      }, 0);
    });

    it('deve limpar busca corretamente', done => {
      store['_searchTerm'].set('Rick');
      store['_currentPage'].set(3);
      mockCharacterService.getCharacters.mockReturnValue(of(mockApiResponse));

      store.clearSearch();

      expect(store.searchTerm()).toBe('');
      expect(store.currentPage()).toBe(1);

      setTimeout(() => {
        expect(mockCharacterService.getCharacters).toHaveBeenCalledWith({
          page: 1,
        });
        done();
      }, 0);
    });
  });

  describe('CRUD Operations - Local Characters', () => {
    it('deve criar personagem local corretamente', () => {
      mockLocalStorageService.saveCharacter.mockReturnValue(mockLocalCharacter);

      const result = store.createCharacter(mockCharacterForm);

      expect(result).toEqual(mockLocalCharacter);
      expect(store.localCharacters()).toContain(mockLocalCharacter);
      expect(mockLocalStorageService.saveCharacter).toHaveBeenCalledWith(mockCharacterForm);
    });

    it('deve atualizar personagem local', () => {
      const updatedCharacter = { ...mockLocalCharacter, name: 'Updated Name' };
      mockLocalStorageService.updateCharacter.mockReturnValue(updatedCharacter);
      store['_localCharacters'].set([mockLocalCharacter]);

      const result = store.updateCharacter(10001, mockCharacterForm);

      expect(result).toEqual(updatedCharacter);
      expect(store.localCharacters()[0].name).toBe('Updated Name');
      expect(mockLocalStorageService.updateCharacter).toHaveBeenCalledWith(10001, mockCharacterForm);
    });

    it('deve excluir personagem local', () => {
      mockLocalStorageService.deleteCharacter.mockReturnValue(true);
      store['_localCharacters'].set([mockLocalCharacter]);

      const result = store.deleteCharacter(10001);

      expect(result).toBe(true);
      expect(store.localCharacters()).not.toContain(mockLocalCharacter);
      expect(mockLocalStorageService.deleteCharacter).toHaveBeenCalledWith(10001);
    });

    it('deve retornar false ao tentar excluir personagem inexistente', () => {
      mockLocalStorageService.deleteCharacter.mockReturnValue(false);

      const result = store.deleteCharacter(99999);

      expect(result).toBe(false);
    });
  });

  describe('getCharacterById() - Sistema Híbrido', () => {
    it('deve retornar personagem local quando existe', () => {
      mockLocalStorageService.getLocalCharacterById.mockReturnValue(mockLocalCharacter);

      const result = store.getCharacterById(10001);

      expect(result).toEqual(mockLocalCharacter);
      expect(mockLocalStorageService.getLocalCharacterById).toHaveBeenCalledWith(10001);
    });

    it('deve retornar personagem da API quando não é local', () => {
      mockLocalStorageService.getLocalCharacterById.mockReturnValue(null);
      store['_characters'].set([mockApiCharacter]);

      const result = store.getCharacterById(1);

      expect(result).toEqual(mockApiCharacter);
    });

    it('deve retornar null quando personagem não existe em lugar nenhum', () => {
      mockLocalStorageService.getLocalCharacterById.mockReturnValue(null);
      store['_characters'].set([]);

      const result = store.getCharacterById(99999);

      expect(result).toBeNull();
    });
  });

  describe('Paginação', () => {
    beforeEach(() => {
      store['_currentPage'].set(2);
      store['_totalPages'].set(5);
    });

    it('deve ir para próxima página quando possível', () => {
      store.nextPage();

      expect(store.currentPage()).toBe(3);
      expect(store.hasNextPage()).toBe(true);
    });

    it('deve ir para página anterior quando possível', () => {
      store.prevPage();

      expect(store.currentPage()).toBe(1);
      expect(store.hasPrevPage()).toBe(false);
    });

    it('NÃO deve ir para próxima página se já estiver na última', () => {
      store['_currentPage'].set(5);

      store.nextPage();

      expect(store.currentPage()).toBe(5);
    });

    it('NÃO deve ir para página anterior se estiver na primeira', () => {
      store['_currentPage'].set(1);

      store.prevPage();

      expect(store.currentPage()).toBe(1);
    });
  });

  describe('Computed Signals Avançados', () => {
    beforeEach(() => {
      store['_localCharacters'].set([mockLocalCharacter]);
      store['_characters'].set([mockApiCharacter]);
    });

    it('deve combinar personagens locais e da API corretamente', () => {
      const all = store.allCharacters();

      expect(all).toHaveLength(2);
      expect(all[0]).toEqual(mockLocalCharacter);
      expect(all[1]).toEqual(mockApiCharacter);
    });

    it('deve calcular estatísticas corretamente', () => {
      const stats = store.getCharacterStats();

      expect(stats).toEqual({
        totalLocal: 1,
        totalFromAPI: 1,
        totalAll: 2,
        aliveCount: 2,
        deadCount: 0,
        unknownCount: 0,
      });
    });

    it('deve identificar personagem local corretamente', () => {
      mockLocalStorageService.isLocalCharacter.mockImplementation(id => id >= 10000);

      expect(store.isLocalCharacter(10001)).toBe(true);
      expect(store.isLocalCharacter(1)).toBe(false);
    });
  });

  describe('Error Handling e Edge Cases', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('deve lidar com erro no createCharacter', () => {
      mockLocalStorageService.saveCharacter.mockImplementation(() => {
        throw new Error('Storage full');
      });

      expect(() => store.createCharacter(mockCharacterForm)).toThrow('Storage full');
      expect(store.localCharacters()).toHaveLength(0);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao criar personagem:', expect.any(Error));
    });

    it('deve lidar com updateCharacter de personagem inexistente', () => {
      mockLocalStorageService.updateCharacter.mockReturnValue(null);

      expect(() => store.updateCharacter(99999, mockCharacterForm)).toThrow('Personagem não encontrado');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao atualizar personagem:', expect.any(Error));
    });

    it('deve filtrar personagens locais por nome', () => {
      const chars = [
        { ...mockLocalCharacter, name: 'Rick Local' },
        { ...mockLocalCharacter, id: 10002, name: 'Morty Local' },
      ];
      store['_localCharacters'].set(chars);

      const filtered = store.filterLocalCharacters('Rick');

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Rick Local');
    });
  });
});
