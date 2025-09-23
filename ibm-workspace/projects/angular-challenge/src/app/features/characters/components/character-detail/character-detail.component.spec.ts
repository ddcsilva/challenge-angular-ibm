import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { CharacterDetailComponent } from './character-detail.component';
import { Character, CharacterStore } from '@features/characters';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CharacterDetailComponent', () => {
  let fixture: ComponentFixture<CharacterDetailComponent>;
  let component: CharacterDetailComponent;

  const routerMock = { navigate: jest.fn() };

  const snackBarMock = { open: jest.fn() };

  const dialogMock = {
    open: jest.fn().mockReturnValue({
      afterClosed: () => of(true),
    }),
  };

  const storeMock = {
    loadLocalCharacters: jest.fn(),
    isLocalCharacter: jest.fn(),
    getCharacterById: jest.fn(),
    deleteCharacter: jest.fn(),
    characterService: {
      getCharacterById: jest.fn(),
    },
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterDetailComponent, NoopAnimationsModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: CharacterStore, useValue: storeMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterDetailComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => jest.clearAllMocks());

  it('deve criar o componente', () => {
    // Configurar um ID válido para evitar erros
    (activatedRouteMock.snapshot.paramMap.get as jest.Mock).mockReturnValue('1');
    storeMock.isLocalCharacter.mockReturnValue(false);
    storeMock.getCharacterById.mockReturnValue(null);
    storeMock.characterService.getCharacterById.mockReturnValue(
      of({
        id: 1,
        name: 'Test',
        image: 'test.jpg',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
        origin: { name: 'Earth' },
        location: { name: 'Earth' },
        episode: ['1'],
      } as Character)
    );

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('deve setar erro se id não estiver presente na rota', () => {
    (activatedRouteMock.snapshot.paramMap.get as jest.Mock).mockReturnValue(null);

    fixture.detectChanges();

    expect(component.error()).toBe('ID do personagem não encontrado');
    expect(component.loading()).toBe(false);
  });

  it('deve setar erro se id for inválido', () => {
    (activatedRouteMock.snapshot.paramMap.get as jest.Mock).mockReturnValue('abc');

    fixture.detectChanges();

    expect(component.error()).toBe('ID do personagem inválido');
    expect(component.loading()).toBe(false);
  });

  it('deve carregar personagem local quando id for válido', () => {
    (activatedRouteMock.snapshot.paramMap.get as jest.Mock).mockReturnValue('123');
    const fakeCharacter: Character = {
      id: 123,
      name: 'Rick',
      image: 'test.jpg',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      origin: { name: 'Earth' },
      location: { name: 'Earth' },
      episode: ['1', '2'],
    } as Character;

    storeMock.isLocalCharacter.mockReturnValue(true);
    storeMock.getCharacterById.mockReturnValue(fakeCharacter);

    fixture.detectChanges();

    expect(storeMock.loadLocalCharacters).toHaveBeenCalled();
    expect(component.character()).toEqual(fakeCharacter);
    expect(component.isLocalCharacter()).toBe(true);
    expect(component.loading()).toBe(false);
  });

  it('deve carregar personagem da API quando não for local', () => {
    (activatedRouteMock.snapshot.paramMap.get as jest.Mock).mockReturnValue('456');
    const fakeCharacter: Character = {
      id: 456,
      name: 'Morty',
      image: 'test.jpg',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      origin: { name: 'Earth' },
      location: { name: 'Earth' },
      episode: ['1', '2'],
    } as Character;

    storeMock.isLocalCharacter.mockReturnValue(false);
    storeMock.getCharacterById.mockReturnValue(null); // Não encontra local
    storeMock.characterService.getCharacterById.mockReturnValue(of(fakeCharacter));

    fixture.detectChanges();

    expect(component.character()).toEqual(fakeCharacter);
    expect(component.isLocalCharacter()).toBe(false);
    expect(component.loading()).toBe(false);
  });

  it('deve bloquear edição se personagem não for local', () => {
    // Configurar o teste para não dar erro no template
    (activatedRouteMock.snapshot.paramMap.get as jest.Mock).mockReturnValue('1');
    storeMock.isLocalCharacter.mockReturnValue(false);
    storeMock.characterService.getCharacterById.mockReturnValue(
      of({
        id: 1,
        name: 'API Rick',
        image: 'test.jpg',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
        origin: { name: 'Earth' },
        location: { name: 'Earth' },
        episode: ['1'],
      } as Character)
    );

    fixture.detectChanges();

    const snackBarSpy = jest.spyOn(component['snackBar'], 'open');

    component['onEdit']();

    expect(snackBarSpy).toHaveBeenCalledWith(
      'Apenas personagens criados localmente podem ser editados',
      'Fechar',
      expect.any(Object)
    );
  });

  it('deve excluir personagem local após confirmação', () => {
    // Configurar o teste para carregar um personagem local
    (activatedRouteMock.snapshot.paramMap.get as jest.Mock).mockReturnValue('999');
    const fakeCharacter: Character = {
      id: 999,
      name: 'Local Rick',
      image: 'test.jpg',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      origin: { name: 'Earth' },
      location: { name: 'Earth' },
      episode: ['1'],
    } as Character;

    storeMock.isLocalCharacter.mockReturnValue(true);
    storeMock.getCharacterById.mockReturnValue(fakeCharacter);
    storeMock.deleteCharacter.mockReturnValue(true);

    fixture.detectChanges();

    const dialogSpy = jest.spyOn(component['dialog'], 'open').mockReturnValue({
      afterClosed: () => of(true),
    } as ReturnType<MatDialog['open']>);
    const snackBarSpy = jest.spyOn(component['snackBar'], 'open');
    const routerSpy = jest.spyOn(component['router'], 'navigate');

    component['onDelete']();

    expect(dialogSpy).toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalledWith('Personagem excluído com sucesso!', 'Fechar', expect.any(Object));
    expect(routerSpy).toHaveBeenCalledWith(['/characters']);
  });

  it('deve bloquear exclusão se personagem não for local', () => {
    // Configurar personagem da API
    (activatedRouteMock.snapshot.paramMap.get as jest.Mock).mockReturnValue('1');
    storeMock.isLocalCharacter.mockReturnValue(false);
    storeMock.characterService.getCharacterById.mockReturnValue(
      of({
        id: 1,
        name: 'API Rick',
        image: 'test.jpg',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
        origin: { name: 'Earth' },
        location: { name: 'Earth' },
        episode: ['1'],
      } as Character)
    );

    fixture.detectChanges();

    const snackBarSpy = jest.spyOn(component['snackBar'], 'open');

    component['onDelete']();

    expect(snackBarSpy).toHaveBeenCalledWith(
      'Apenas personagens criados localmente podem ser excluídos',
      'Fechar',
      expect.any(Object)
    );
  });

  it('deve navegar para edição quando personagem for local', () => {
    // Configurar personagem local
    (activatedRouteMock.snapshot.paramMap.get as jest.Mock).mockReturnValue('999');
    const fakeCharacter: Character = {
      id: 999,
      name: 'Local Rick',
      image: 'test.jpg',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      origin: { name: 'Earth' },
      location: { name: 'Earth' },
      episode: ['1'],
    } as Character;

    storeMock.isLocalCharacter.mockReturnValue(true);
    storeMock.getCharacterById.mockReturnValue(fakeCharacter);

    fixture.detectChanges();

    const routerSpy = jest.spyOn(component['router'], 'navigate');

    component['onEdit']();

    expect(routerSpy).toHaveBeenCalledWith(['/characters', 999, 'edit']);
  });

  it('deve tratar erro ao carregar personagem da API', () => {
    (activatedRouteMock.snapshot.paramMap.get as jest.Mock).mockReturnValue('456');

    storeMock.isLocalCharacter.mockReturnValue(false);
    storeMock.getCharacterById.mockReturnValue(null);
    storeMock.characterService.getCharacterById.mockReturnValue(throwError(() => new Error('API Error')));

    fixture.detectChanges();

    expect(component.error()).toBe('Erro ao carregar personagem');
    expect(component.loading()).toBe(false);
  });

  it('deve chamar goBack corretamente', () => {
    (activatedRouteMock.snapshot.paramMap.get as jest.Mock).mockReturnValue('1');
    storeMock.isLocalCharacter.mockReturnValue(false);
    storeMock.characterService.getCharacterById.mockReturnValue(
      of({
        id: 1,
        name: 'Test',
        image: 'test.jpg',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
        origin: { name: 'Earth' },
        location: { name: 'Earth' },
        episode: ['1'],
      } as Character)
    );

    fixture.detectChanges();

    const routerSpy = jest.spyOn(component['router'], 'navigate');

    component['goBack']();

    expect(routerSpy).toHaveBeenCalledWith(['/characters']);
  });

  it('deve chamar snackBar de erro ao excluir personagem', () => {
    const characterId = 1;
    storeMock.deleteCharacter.mockReturnValue(false);
    fixture.detectChanges();
    component['deleteCharacter'](characterId);
    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Erro ao excluir personagem. Tente novamente.',
      'Fechar',
      expect.any(Object)
    );
  });

  it('deve chamar retornar a classe correta para o status Alive', () => {
    const status = 'Alive';
    const result = component['getStatusClass'](status);
    expect(result).toBe('text-green-600');
  });

  it('deve chamar retornar a classe correta para o status Dead', () => {
    const status = 'Dead';
    const result = component['getStatusClass'](status);
    expect(result).toBe('text-red-600');
  });

  it('deve chamar retornar a classe correta para o status unknown', () => {
    const status = 'unknown';
    const result = component['getStatusClass'](status);
    expect(result).toBe('text-gray-600');
  });
});
