import { CharacterLocalStorageService } from './character-local-storage.service';
import { CharacterForm } from './character.model';

describe('CharacterLocalStorageService', () => {
  let service: CharacterLocalStorageService;

  beforeEach(() => {
    service = new CharacterLocalStorageService();

    let store: Record<string, string> = {};
    const mockLocalStorage = {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser criado o serviço', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar lista vazia se não houver nada no localStorage', () => {
    const result = service.getLocalCharacters();
    expect(result).toEqual([]);
  });

  it('deve salvar um novo personagem no localStorage', () => {
    const form: CharacterForm = {
      name: 'Rick',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
    } as CharacterForm;

    const result = service.saveCharacter(form);

    expect(result.id).toBeGreaterThanOrEqual(10001);
    expect(result.name).toBe('Rick');
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('deve atualizar um personagem existente', () => {
    const form: CharacterForm = {
      name: 'Morty',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
    } as CharacterForm;

    const character = service.saveCharacter(form);

    const updatedForm: CharacterForm = { ...form, name: 'Morty Smith' };
    const updated = service.updateCharacter(character.id, updatedForm);

    expect(updated?.name).toBe('Morty Smith');
  });

  it('deve deletar um personagem existente', () => {
    const form: CharacterForm = {
      name: 'Summer',
      status: 'Alive',
      species: 'Human',
      gender: 'Female',
    } as CharacterForm;

    const character = service.saveCharacter(form);

    const deleted = service.deleteCharacter(character.id);
    expect(deleted).toBe(true);

    const characters = service.getLocalCharacters();
    expect(characters.find(c => c.id === character.id)).toBeUndefined();
  });

  it('deve retornar true se personagem for local', () => {
    const form: CharacterForm = {
      name: 'Beth',
      status: 'Alive',
      species: 'Human',
      gender: 'Female',
    } as CharacterForm;

    const character = service.saveCharacter(form);

    expect(service.isLocalCharacter(character.id)).toBe(true);
  });

  it('deve retornar personagem por id', () => {
    const form: CharacterForm = {
      name: 'Jerry',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
    } as CharacterForm;

    const character = service.saveCharacter(form);

    const found = service.getLocalCharacterById(character.id);
    expect(found?.id).toBe(character.id);
  });

  it('deve limpar todos os personagens do localStorage', () => {
    const form: CharacterForm = {
      name: 'Birdperson',
      status: 'Alive',
      species: 'Alien',
      gender: 'Male',
    } as CharacterForm;

    service.saveCharacter(form);
    service.clearLocalCharacters();

    expect(localStorage.removeItem).toHaveBeenCalledWith('rick-morty-local-characters');
    expect(localStorage.removeItem).toHaveBeenCalledWith('rick-morty-character-counter');
  });
});
