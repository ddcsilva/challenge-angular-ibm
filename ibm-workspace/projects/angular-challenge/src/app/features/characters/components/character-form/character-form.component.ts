import { ChangeDetectionStrategy, Component, inject, input, output, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Character, CharacterStatus, CharacterGender, CharacterForm, CharacterStore } from '@features/characters';
import { CharacterSpeciesPipe, CharacterStatusPipe, CharacterGenderPipe } from '@ui/index';

@Component({
  selector: 'ibm-character-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    CharacterSpeciesPipe,
    CharacterStatusPipe,
    CharacterGenderPipe,
  ],
  templateUrl: './character-form.component.html',
  styleUrl: './character-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterFormComponent implements OnInit {
  // Inputs
  readonly editCharacter = input<Character | null>(null);
  readonly isEditing = input<boolean>(false);

  // Outputs
  readonly formSubmit = output<CharacterForm>();
  readonly formCancel = output<void>();

  // Dependencies
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  protected readonly store = inject(CharacterStore);

  // Form
  characterForm!: FormGroup;
  readonly isSubmitting = signal(false);

  // Enums para o template
  protected readonly CharacterStatus = CharacterStatus;
  protected readonly CharacterGender = CharacterGender;

  // Arrays para os selects
  protected readonly statusOptions = Object.values(CharacterStatus);
  protected readonly genderOptions = Object.values(CharacterGender);

  ngOnInit(): void {
    this.initializeForm();
    this.loadCharacterData();
  }

  private initializeForm(): void {
    this.characterForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      status: [CharacterStatus.ALIVE, [Validators.required]],
      species: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      gender: [CharacterGender.UNKNOWN, [Validators.required]],
      type: ['', [Validators.maxLength(50)]],
    });
  }

  private loadCharacterData(): void {
    const character = this.editCharacter();
    if (character && this.isEditing()) {
      this.characterForm.patchValue({
        name: character.name,
        status: character.status,
        species: character.species,
        gender: character.gender,
        type: character.type || '',
      });
    }
  }

  onSubmit(): void {
    if (this.characterForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);

      const formData: CharacterForm = {
        name: this.characterForm.value.name?.trim(),
        status: this.characterForm.value.status,
        species: this.characterForm.value.species?.trim(),
        gender: this.characterForm.value.gender,
        type: this.characterForm.value.type?.trim() || undefined,
      };

      // Simula delay da API
      setTimeout(() => {
        this.formSubmit.emit(formData);
        this.isSubmitting.set(false);

        const action = this.isEditing() ? 'editado' : 'criado';
        this.snackBar.open(`Personagem ${action} com sucesso!`, 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      }, 500);
    } else {
      this.markAllFieldsAsTouched();
      this.snackBar.open('Por favor, corrija os erros no formulário', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  onReset(): void {
    this.characterForm.reset();
    this.initializeForm();
  }

  getFieldError(fieldName: string): string {
    const field = this.characterForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `Mínimo ${requiredLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        const requiredLength = field.errors['maxlength'].requiredLength;
        return `Máximo ${requiredLength} caracteres`;
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.characterForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.characterForm.controls).forEach(key => {
      this.characterForm.get(key)?.markAsTouched();
    });
  }
}
