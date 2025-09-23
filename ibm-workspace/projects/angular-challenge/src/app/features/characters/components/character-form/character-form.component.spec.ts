import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CharacterFormComponent } from './character-form.component';
import { CharacterStore } from '@features/characters';
import { CharacterStatus, CharacterGender } from '@features/characters';

// Mock CharacterStore
class MockCharacterStore {
  // Add mock methods as needed
}

describe('CharacterFormComponent', () => {
  let component: CharacterFormComponent;
  let fixture: ComponentFixture<CharacterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterFormComponent, ReactiveFormsModule, NoopAnimationsModule, MatSnackBarModule],
      providers: [{ provide: CharacterStore, useClass: MockCharacterStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.characterForm.get('name')?.value).toBe('');
    expect(component.characterForm.get('status')?.value).toBe(CharacterStatus.ALIVE);
    expect(component.characterForm.get('species')?.value).toBe('');
    expect(component.characterForm.get('gender')?.value).toBe(CharacterGender.UNKNOWN);
    expect(component.characterForm.get('type')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const nameControl = component.characterForm.get('name');
    const speciesControl = component.characterForm.get('species');

    expect(nameControl?.hasError('required')).toBeTruthy();
    expect(speciesControl?.hasError('required')).toBeTruthy();
  });

  it('should validate field lengths', () => {
    const nameControl = component.characterForm.get('name');
    const speciesControl = component.characterForm.get('species');

    nameControl?.setValue('A'); // Too short
    speciesControl?.setValue('B'); // Too short

    expect(nameControl?.hasError('minlength')).toBeTruthy();
    expect(speciesControl?.hasError('minlength')).toBeTruthy();

    nameControl?.setValue('A'.repeat(51)); // Too long
    speciesControl?.setValue('B'.repeat(31)); // Too long

    expect(nameControl?.hasError('maxlength')).toBeTruthy();
    expect(speciesControl?.hasError('maxlength')).toBeTruthy();
  });

  it('should emit formSubmit when form is valid and submitted', () => {
    jest.spyOn(component.formSubmit, 'emit');

    // Fill form with valid data
    component.characterForm.patchValue({
      name: 'Test Character',
      status: CharacterStatus.ALIVE,
      species: 'Human',
      gender: CharacterGender.MALE,
      type: 'Test Type',
    });

    component.onSubmit();

    // Wait for setTimeout
    setTimeout(() => {
      expect(component.formSubmit.emit).toHaveBeenCalledWith({
        name: 'Test Character',
        status: CharacterStatus.ALIVE,
        species: 'Human',
        gender: CharacterGender.MALE,
        type: 'Test Type',
      });
    }, 600);
  });

  it('should emit formCancel when cancel is clicked', () => {
    jest.spyOn(component.formCancel, 'emit');

    component.onCancel();

    expect(component.formCancel.emit).toHaveBeenCalled();
  });

  it('should reset form when reset is clicked', () => {
    // Fill form with data
    component.characterForm.patchValue({
      name: 'Test Character',
      species: 'Human',
    });

    component.onReset();

    expect(component.characterForm.get('name')?.value).toBe('');
    expect(component.characterForm.get('species')?.value).toBe('');
  });

  it('should return correct field errors', () => {
    const nameControl = component.characterForm.get('name');
    nameControl?.markAsTouched();

    expect(component.getFieldError('name')).toBe('Este campo é obrigatório');

    nameControl?.setValue('A');
    expect(component.getFieldError('name')).toBe('Mínimo 2 caracteres');

    nameControl?.setValue('A'.repeat(51));
    expect(component.getFieldError('name')).toBe('Máximo 50 caracteres');
  });

  it('should correctly identify invalid fields', () => {
    const nameControl = component.characterForm.get('name');

    expect(component.isFieldInvalid('name')).toBeFalsy();

    nameControl?.markAsTouched();
    expect(component.isFieldInvalid('name')).toBeTruthy();

    nameControl?.setValue('Valid Name');
    expect(component.isFieldInvalid('name')).toBeFalsy();
  });
});
