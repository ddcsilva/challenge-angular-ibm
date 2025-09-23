import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CharacterFormComponent } from '../character-form/character-form.component';
import { Character, CharacterForm, CharacterStore } from '@features/characters';

@Component({
  selector: 'ibm-character-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CharacterFormComponent,
  ],
  template: `
    @if (loading()) {
      <div class="loading-container">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Carregando personagem...</p>
      </div>
    } @else if (error()) {
      <mat-card class="error-card">
        <mat-card-header>
          <mat-icon mat-card-avatar color="warn">error</mat-icon>
          <mat-card-title>Erro ao carregar personagem</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>{{ error() }}</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="goBack()">Voltar para a lista</button>
        </mat-card-actions>
      </mat-card>
    } @else if (character()) {
      <ibm-character-form
        [isEditing]="true"
        [editCharacter]="character()"
        (formSubmit)="onFormSubmit($event)"
        (formCancel)="onFormCancel()"
      />
    }
  `,
  styles: [
    `
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        gap: 1rem;
      }

      .error-card {
        max-width: 500px;
        margin: 2rem auto;
      }

      .error-card mat-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterEditComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(CharacterStore);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly character = signal<Character | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.error.set('ID do personagem não encontrado');
      this.loading.set(false);
      return;
    }

    const characterId = parseInt(idParam, 10);

    if (isNaN(characterId)) {
      this.error.set('ID do personagem inválido');
      this.loading.set(false);
      return;
    }

    this.loadCharacter(characterId);
  }

  private loadCharacter(id: number): void {
    // Carrega personagens locais primeiro
    this.store.loadLocalCharacters();

    // Verifica se é um personagem local
    if (this.store.isLocalCharacter(id)) {
      const localCharacter = this.store.getCharacterById(id);
      if (localCharacter) {
        this.character.set(localCharacter);
        this.loading.set(false);
      } else {
        this.error.set('Personagem local não encontrado');
        this.loading.set(false);
      }
      return;
    }

    // Se não for local, não permite edição (personagens da API são read-only)
    this.error.set('Apenas personagens criados localmente podem ser editados');
    this.loading.set(false);
  }

  protected onFormSubmit(characterForm: CharacterForm): void {
    const currentCharacter = this.character();
    if (!currentCharacter) return;

    try {
      const updatedCharacter = this.store.updateCharacter(currentCharacter.id, characterForm);

      this.snackBar.open(`Personagem "${updatedCharacter.name}" atualizado com sucesso!`, 'Fechar', {
        duration: 4000,
        panelClass: ['success-snackbar'],
      });

      // Redireciona para o detalhe do personagem
      this.router.navigate(['/characters', currentCharacter.id]);
    } catch (error) {
      console.error('Erro ao atualizar personagem:', error);

      this.snackBar.open('Erro ao atualizar personagem. Tente novamente.', 'Fechar', {
        duration: 4000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  protected onFormCancel(): void {
    const currentCharacter = this.character();
    if (currentCharacter) {
      this.router.navigate(['/characters', currentCharacter.id]);
    } else {
      this.router.navigate(['/characters']);
    }
  }

  protected goBack(): void {
    this.router.navigate(['/characters']);
  }
}
