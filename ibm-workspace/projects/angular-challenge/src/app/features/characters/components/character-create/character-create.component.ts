import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CharacterFormComponent } from '../character-form/character-form.component';
import { CharacterForm, CharacterStore } from '@features/characters';

@Component({
  selector: 'ibm-character-create',
  standalone: true,
  imports: [CharacterFormComponent],
  template: `
    <ibm-character-form [isEditing]="false" (formSubmit)="onFormSubmit($event)" (formCancel)="onFormCancel()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterCreateComponent {
  private readonly router = inject(Router);
  private readonly store = inject(CharacterStore);
  private readonly snackBar = inject(MatSnackBar);

  protected onFormSubmit(characterForm: CharacterForm): void {
    try {
      const newCharacter = this.store.createCharacter(characterForm);

      this.snackBar.open(`Personagem "${newCharacter.name}" criado com sucesso!`, 'Fechar', {
        duration: 4000,
        panelClass: ['success-snackbar'],
      });

      // Redireciona para a lista
      this.router.navigate(['/characters']);
    } catch (error) {
      console.error('Erro ao criar personagem:', error);

      this.snackBar.open('Erro ao criar personagem. Tente novamente.', 'Fechar', {
        duration: 4000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  protected onFormCancel(): void {
    this.router.navigate(['/characters']);
  }
}
