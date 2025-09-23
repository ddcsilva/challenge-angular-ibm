import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CharacterEditComponent } from './character-edit.component';
import { Character, CharacterForm, CharacterStore } from '@features/characters';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CharacterEditComponent', () => {
  let fixture: ComponentFixture<CharacterEditComponent>;
  let component: CharacterEditComponent;

  const routerMock: jest.Mocked<Pick<Router, 'navigate'>> = {
    navigate: jest.fn(),
  };

  const snackBarMock: jest.Mocked<Pick<MatSnackBar, 'open'>> = {
    open: jest.fn(),
  };

  const storeMock = {
    loadLocalCharacters: jest.fn(),
    isLocalCharacter: jest.fn(),
    getCharacterById: jest.fn(),
    updateCharacter: jest.fn(),
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
      imports: [CharacterEditComponent, NoopAnimationsModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: CharacterStore, useValue: storeMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve setar erro quando id não estiver presente na rota', () => {
    (activatedRouteMock.snapshot.paramMap.get as jest.Mock).mockReturnValue(null);

    fixture = TestBed.createComponent(CharacterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component['error']()).toBe('ID do personagem não encontrado');
    expect(component['loading']()).toBe(false);
  });

  it('deve setar erro quando id for inválido', () => {
    (activatedRouteMock.snapshot.paramMap.get as jest.Mock).mockReturnValue('abc');

    fixture = TestBed.createComponent(CharacterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component['error']()).toBe('ID do personagem inválido');
    expect(component['loading']()).toBe(false);
  });

  it('deve carregar personagem local quando id for válido e existir', () => {
    (activatedRouteMock.snapshot.paramMap.get as jest.Mock).mockReturnValue('123');

    const fakeCharacter: Character = { id: 123, name: 'Rick Sanchez' } as Character;

    storeMock.loadLocalCharacters.mockImplementation(() => {
      return null;
    });
    storeMock.isLocalCharacter.mockReturnValue(true);
    storeMock.getCharacterById.mockReturnValue(fakeCharacter);

    fixture = TestBed.createComponent(CharacterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(storeMock.loadLocalCharacters).toHaveBeenCalled();
    expect(storeMock.isLocalCharacter).toHaveBeenCalledWith(123);
    expect(storeMock.getCharacterById).toHaveBeenCalledWith(123);
    expect(component['character']()).toEqual(fakeCharacter);
    expect(component['loading']()).toBe(false);
    expect(component['error']()).toBeNull();
  });

  it('deve setar erro quando personagem local não for encontrado', () => {
    (activatedRouteMock.snapshot.paramMap.get as jest.Mock).mockReturnValue('456');

    storeMock.loadLocalCharacters.mockImplementation(() => {
      return null;
    });
    storeMock.isLocalCharacter.mockReturnValue(true);
    storeMock.getCharacterById.mockReturnValue(null);

    fixture = TestBed.createComponent(CharacterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(storeMock.loadLocalCharacters).toHaveBeenCalled();
    expect(storeMock.isLocalCharacter).toHaveBeenCalledWith(456);
    expect(storeMock.getCharacterById).toHaveBeenCalledWith(456);
    expect(component['error']()).toBe('Personagem local não encontrado');
    expect(component['loading']()).toBe(false);
    expect(component['character']()).toBeNull();
  });

  it('deve setar erro quando personagem não for local', () => {
    (activatedRouteMock.snapshot.paramMap.get as jest.Mock).mockReturnValue('789');

    storeMock.loadLocalCharacters.mockImplementation(() => {
      return null;
    });
    storeMock.isLocalCharacter.mockReturnValue(false);

    fixture = TestBed.createComponent(CharacterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(storeMock.loadLocalCharacters).toHaveBeenCalled();
    expect(storeMock.isLocalCharacter).toHaveBeenCalledWith(789);
    expect(component['error']()).toBe('Apenas personagens criados localmente podem ser editados');
    expect(component['loading']()).toBe(false);
    expect(component['character']()).toBeNull();
  });

  it('deve atualizar personagem e mostrar snackbar de sucesso ao submeter o formulário', () => {
    const currentCharacter: Character = { id: 1, name: 'Rick Sanchez' } as Character;
    const fakeForm: CharacterForm = { name: 'Novo Rick' } as CharacterForm;
    const updatedCharacter: Character = { id: 1, name: 'Novo Rick' } as Character;

    component['character'].set(currentCharacter);

    storeMock.updateCharacter.mockReturnValue(updatedCharacter);

    const snackBarSpy = jest.spyOn(component['snackBar'], 'open');
    const routerSpy = jest.spyOn(component['router'], 'navigate');

    component['onFormSubmit'](fakeForm);

    expect(storeMock.updateCharacter).toHaveBeenCalledWith(1, fakeForm);
    expect(snackBarSpy).toHaveBeenCalledWith(
      'Personagem "Novo Rick" atualizado com sucesso!',
      'Fechar',
      expect.objectContaining({ duration: 4000, panelClass: ['success-snackbar'] })
    );
    expect(routerSpy).toHaveBeenCalledWith(['/characters', 1]);
  });

  it('deve mostrar snackbar de erro quando falhar ao atualizar personagem', () => {
    const currentCharacter: Character = { id: 2, name: 'Morty' } as Character;
    const fakeForm: CharacterForm = { name: 'Novo Morty' } as CharacterForm;
    const error = new Error('Falha na atualização');

    component['character'].set(currentCharacter);

    storeMock.updateCharacter.mockImplementation(() => {
      throw error;
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const snackBarSpy = jest.spyOn(component['snackBar'], 'open');
    const routerSpy = jest.spyOn(component['router'], 'navigate');

    component['onFormSubmit'](fakeForm);

    expect(storeMock.updateCharacter).toHaveBeenCalledWith(2, fakeForm);
    expect(consoleSpy).toHaveBeenCalledWith('Erro ao atualizar personagem:', error);
    expect(snackBarSpy).toHaveBeenCalledWith(
      'Erro ao atualizar personagem. Tente novamente.',
      'Fechar',
      expect.objectContaining({ duration: 4000, panelClass: ['error-snackbar'] })
    );
    expect(routerSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('deve navegar para detalhe ao cancelar se personagem existir', () => {
    const currentCharacter: Character = { id: 3, name: 'Summer' } as Character;
    component['character'].set(currentCharacter);

    const routerSpy = jest.spyOn(component['router'], 'navigate');

    component['onFormCancel']();

    expect(routerSpy).toHaveBeenCalledWith(['/characters', 3]);
  });

  it('deve navegar para lista ao cancelar se personagem não existir', () => {
    component['character'].set(null);

    const routerSpy = jest.spyOn(component['router'], 'navigate');

    component['onFormCancel']();

    expect(routerSpy).toHaveBeenCalledWith(['/characters']);
  });

  it('deve navegar para lista ao chamar goBack', () => {
    const routerSpy = jest.spyOn(component['router'], 'navigate');

    component['goBack']();

    expect(routerSpy).toHaveBeenCalledWith(['/characters']);
  });
});
