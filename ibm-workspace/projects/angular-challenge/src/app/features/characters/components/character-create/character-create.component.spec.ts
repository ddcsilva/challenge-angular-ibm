import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CharacterCreateComponent } from './character-create.component';
import { CharacterForm, Character, CharacterStore } from '@features/characters';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CharacterCreateComponent', () => {
  let fixture: ComponentFixture<CharacterCreateComponent>;
  let component: CharacterCreateComponent;

  const routerMock: jest.Mocked<Pick<Router, 'navigate'>> = {
    navigate: jest.fn(),
  };

  const snackBarMock: jest.Mocked<Pick<MatSnackBar, 'open'>> = {
    open: jest.fn(),
  };

  const storeMock = {
    createCharacter: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterCreateComponent, NoopAnimationsModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: CharacterStore, useValue: storeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve criar personagem e mostrar snackbar de sucesso ao submeter o formulário', () => {
    const fakeForm: CharacterForm = { name: 'Rick Sanchez' } as CharacterForm;
    const fakeCharacter: Character = { id: 1, name: 'Rick Sanchez' } as Character;

    storeMock.createCharacter.mockReturnValue(fakeCharacter);

    const snackBarSpy = jest.spyOn(component['snackBar'], 'open');
    const routerSpy = jest.spyOn(component['router'], 'navigate');

    component['onFormSubmit'](fakeForm);

    expect(storeMock.createCharacter).toHaveBeenCalledWith(fakeForm);
    expect(snackBarSpy).toHaveBeenCalledWith(
      'Personagem "Rick Sanchez" criado com sucesso!',
      'Fechar',
      expect.objectContaining({ duration: 4000, panelClass: ['success-snackbar'] })
    );
    expect(routerSpy).toHaveBeenCalledWith(['/characters']);
  });

  it('deve mostrar snackbar de erro quando falhar ao criar personagem', () => {
    const fakeForm: CharacterForm = { name: 'Rick Sanchez' } as CharacterForm;
    const error = new Error('Erro ao salvar');

    storeMock.createCharacter.mockImplementation(() => {
      throw error;
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const snackBarSpy = jest.spyOn(component['snackBar'], 'open');
    const routerSpy = jest.spyOn(component['router'], 'navigate');

    component['onFormSubmit'](fakeForm);

    expect(storeMock.createCharacter).toHaveBeenCalledWith(fakeForm);
    expect(consoleSpy).toHaveBeenCalledWith('Erro ao criar personagem:', error);
    expect(snackBarSpy).toHaveBeenCalledWith(
      'Erro ao criar personagem. Tente novamente.',
      'Fechar',
      expect.objectContaining({ duration: 4000, panelClass: ['error-snackbar'] })
    );
    expect(routerSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('deve navegar para lista de personagens quando cancelar o formulário', () => {
    const routerSpy = jest.spyOn(component['router'], 'navigate');

    component['onFormCancel']();

    expect(routerSpy).toHaveBeenCalledWith(['/characters']);
  });
});
