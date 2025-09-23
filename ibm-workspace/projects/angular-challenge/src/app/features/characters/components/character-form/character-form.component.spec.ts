import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CharacterFormComponent } from './character-form.component';
import { Character, CharacterStatus, CharacterGender, CharacterStore } from '@features/characters';

describe('CharacterFormComponent', () => {
  let fixture: ComponentFixture<CharacterFormComponent>;
  let component: CharacterFormComponent;

  const snackBarMock = { open: jest.fn() };

  const storeMock = {
    loadLocalCharacters: jest.fn(),
    isLocalCharacter: jest.fn(),
    getCharacterById: jest.fn(),
    updateCharacter: jest.fn(),
    deleteCharacter: jest.fn(),
    characterService: {
      getCharacterById: jest.fn(),
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterFormComponent, NoopAnimationsModule],
      providers: [
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: CharacterStore, useValue: storeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterFormComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => jest.clearAllMocks());

  it('deve criar o componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.characterForm).toBeDefined();
  });

  it('deve carregar dados no formulário quando em edição', () => {
    const fakeCharacter: Character = {
      id: 1,
      name: 'Rick',
      status: CharacterStatus.ALIVE,
      species: 'Human',
      gender: CharacterGender.MALE,
      type: 'Scientist',
      image: 'test.jpg',
      origin: { name: 'Earth', url: 'http://test.com' },
      location: { name: 'Earth', url: 'http://test.com' },
      episode: [],
      created: '2021-01-01',
      url: 'http://test.com',
    } as Character;

    fixture.componentRef.setInput('editCharacter', fakeCharacter);
    fixture.componentRef.setInput('isEditing', true);

    fixture.detectChanges();
    component.ngOnInit();

    expect(component.characterForm.value).toEqual(
      expect.objectContaining({
        name: 'Rick',
        status: CharacterStatus.ALIVE,
        species: 'Human',
        gender: CharacterGender.MALE,
        type: 'Scientist',
      })
    );
  });

  it('deve emitir formSubmit quando formulário for válido e submetido', fakeAsync(() => {
    jest.spyOn(component.formSubmit, 'emit');
    const snackBarSpy = jest.spyOn(component['snackBar'], 'open');

    fixture.detectChanges();

    component.characterForm.patchValue({
      name: 'Test Character',
      status: CharacterStatus.ALIVE,
      species: 'Human',
      gender: CharacterGender.MALE,
      type: 'Test',
    });

    component['onSubmit']();

    tick(500);

    expect(component.formSubmit.emit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test Character',
        status: CharacterStatus.ALIVE,
        species: 'Human',
        gender: CharacterGender.MALE,
        type: 'Test',
      })
    );

    expect(snackBarSpy).toHaveBeenCalledWith(
      'Personagem criado com sucesso!',
      'Fechar',
      expect.objectContaining({
        duration: 3000,
        panelClass: ['success-snackbar'],
      })
    );
  }));

  it('deve emitir formCancel quando cancelar', () => {
    jest.spyOn(component.formCancel, 'emit');

    fixture.detectChanges();

    component['onCancel']();

    expect(component.formCancel.emit).toHaveBeenCalled();
  });

  it('deve validar campos obrigatórios', () => {
    fixture.detectChanges();

    const nameControl = component.characterForm.get('name');
    const statusControl = component.characterForm.get('status');
    const speciesControl = component.characterForm.get('species');
    const genderControl = component.characterForm.get('gender');

    nameControl?.setValue('');
    speciesControl?.setValue('');

    expect(nameControl?.invalid).toBeTruthy();
    expect(speciesControl?.invalid).toBeTruthy();
    expect(statusControl?.valid).toBeTruthy();
    expect(genderControl?.valid).toBeTruthy();
  });

  it('deve não submeter quando formulário inválido', () => {
    jest.spyOn(component.formSubmit, 'emit');
    const snackBarSpy = jest.spyOn(component['snackBar'], 'open');

    fixture.detectChanges();

    component.characterForm.patchValue({
      name: '',
      species: '',
    });

    component['onSubmit']();

    expect(component.formSubmit.emit).not.toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalledWith(
      'Por favor, corrija os erros no formulário',
      'Fechar',
      expect.objectContaining({
        duration: 3000,
        panelClass: ['error-snackbar'],
      })
    );
  });

  it('deve mostrar snackbar de edição quando em modo de edição', fakeAsync(() => {
    jest.spyOn(component.formSubmit, 'emit');
    const snackBarSpy = jest.spyOn(component['snackBar'], 'open');

    fixture.componentRef.setInput('isEditing', true);
    fixture.detectChanges();

    component.characterForm.patchValue({
      name: 'Edited Character',
      status: CharacterStatus.ALIVE,
      species: 'Human',
      gender: CharacterGender.MALE,
      type: 'Test',
    });

    component['onSubmit']();
    tick(500);

    expect(snackBarSpy).toHaveBeenCalledWith(
      'Personagem editado com sucesso!',
      'Fechar',
      expect.objectContaining({
        duration: 3000,
        panelClass: ['success-snackbar'],
      })
    );
  }));

  it('deve resetar o formulário corretamente', () => {
    fixture.detectChanges();

    component.characterForm.patchValue({
      name: 'Test',
      species: 'Human',
    });

    component['onReset']();

    expect(component.characterForm.get('name')?.value).toBe('');
    expect(component.characterForm.get('status')?.value).toBe(CharacterStatus.ALIVE);
    expect(component.characterForm.get('species')?.value).toBe('');
    expect(component.characterForm.get('gender')?.value).toBe(CharacterGender.UNKNOWN);
  });
});
