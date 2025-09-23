import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CharacterService } from './character.service';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Character, CharacterApiResponse, CharacterGender, CharacterStatus } from './character.model';

describe('CharacterService', () => {
  let service: CharacterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CharacterService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CharacterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve criar o serviço', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar lista de personagens sem filtros', () => {
    const mockResponse: CharacterApiResponse = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [{ id: 1, name: 'Rick Sanchez' } as Character],
    };

    service.getCharacters().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/character');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);
    req.flush(mockResponse);
  });

  it('deve buscar lista de personagens com filtros', () => {
    const mockResponse: CharacterApiResponse = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [{ id: 2, name: 'Morty Smith' } as Character],
    };

    const filters = {
      name: 'Morty',
      status: CharacterStatus.ALIVE,
      species: 'Human',
      gender: CharacterGender.MALE,
      page: 2,
    };

    service.getCharacters(filters).subscribe(res => {
      expect(res.results[0].name).toBe('Morty Smith');
    });

    const req = httpMock.expectOne(r => r.url === 'https://rickandmortyapi.com/api/character');

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('name')).toBe('Morty');
    expect(req.request.params.get('status')).toBe('Alive');
    expect(req.request.params.get('species')).toBe('Human');
    expect(req.request.params.get('gender')).toBe('Male');
    expect(req.request.params.get('page')).toBe('2');

    req.flush(mockResponse);
  });

  it('deve buscar personagem por ID', () => {
    const mockCharacter: Character = { id: 42, name: 'Birdperson' } as Character;

    service.getCharacterById(42).subscribe(res => {
      expect(res).toEqual(mockCharacter);
    });

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/character/42');
    expect(req.request.method).toBe('GET');
    req.flush(mockCharacter);
  });
});
