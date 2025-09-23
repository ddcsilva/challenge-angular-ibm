import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CharacterListComponent } from './character-list.component';
import { Character, CharacterStore } from '@features/characters';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CharacterListComponent', () => {
  let fixture: ComponentFixture<CharacterListComponent>;
  let component: CharacterListComponent;

  const storeMock = {
    loadCharacters: jest.fn(),
    searchCharacters: jest.fn(),
    clearSearch: jest.fn(),

    searchTerm: jest.fn(() => ''),
    characters: jest.fn(() => []),
    localCharacters: jest.fn(() => []),
    loading: jest.fn(() => false),
    error: jest.fn(() => null),
    currentPage: jest.fn(() => 1),
    totalPages: jest.fn(() => 0),
    hasCharacters: jest.fn(() => false),
    hasNextPage: jest.fn(() => false),
    hasPrevPage: jest.fn(() => false),
    allCharacters: jest.fn(() => []),
    localCharactersCount: jest.fn(() => 0),
  };

  const routerMock: jest.Mocked<Pick<Router, 'navigate'>> = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterListComponent, NoopAnimationsModule], // standalone resolve imports
      providers: [
        { provide: CharacterStore, useValue: storeMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar loadCharacters no ngOnInit', () => {
    expect(storeMock.loadCharacters).toHaveBeenCalledTimes(1);
  });

  it('deve chamar searchCharacters após debounce no onSearchChange', fakeAsync(() => {
    component['onSearchChange']('Rick');
    tick(300);
    expect(storeMock.searchCharacters).toHaveBeenCalledWith('Rick');
  }));

  it('deve navegar para o personagem ao clicar no card', () => {
    component['onCharacterCardClick'](123);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/characters', 123]);
  });

  it('deve navegar para criação de personagem ao chamar onCreateCharacter', () => {
    component['onCreateCharacter']();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/characters/new']);
  });

  it('deve chamar clearSearch ao limpar busca', () => {
    component['onClearSearch']();
    expect(storeMock.clearSearch).toHaveBeenCalledTimes(1);
  });

  it('deve chamar trackByCharacterId corretamente', () => {
    const character = { id: 1, name: 'Rick' } as Character;
    const result = component['trackByCharacterId'](0, character);
    expect(result).toBe(1);
  });
});
