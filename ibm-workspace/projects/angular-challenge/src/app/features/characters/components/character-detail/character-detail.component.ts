import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Character, CharacterStore } from '@features/characters';
import { CharacterSpeciesPipe, CharacterStatusPipe, CharacterGenderPipe } from '@ui/index';
import { DeleteConfirmationDialogComponent, DeleteConfirmationData } from '@ui/components';

@Component({
  selector: 'ibm-character-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule,
    CharacterStatusPipe,
    CharacterSpeciesPipe,
    CharacterGenderPipe,
  ],
  templateUrl: './character-detail.component.html',
  styleUrl: './character-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterDetailComponent implements OnInit {
  private store = inject(CharacterStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Estado local
  character = signal<Character | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  // Computed signals
  isLocalCharacter = signal(false);

  ngOnInit() {
    this.loadCharacter();
  }

  private loadCharacter() {
    this.loading.set(true);
    this.error.set(null);

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

    // Carrega personagens locais primeiro
    this.store.loadLocalCharacters();

    // Verifica se é um personagem local
    if (this.store.isLocalCharacter(characterId)) {
      const localCharacter = this.store.getCharacterById(characterId);
      if (localCharacter) {
        this.character.set(localCharacter);
        this.isLocalCharacter.set(true);
        this.loading.set(false);
        return;
      }
    }

    // Se não for local, busca na API
    this.store.characterService.getCharacterById(characterId).subscribe({
      next: character => {
        this.character.set(character);
        this.isLocalCharacter.set(false);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar personagem');
        this.loading.set(false);
      },
    });
  }

  protected goBack() {
    this.router.navigate(['/characters']);
  }

  protected onEdit() {
    const character = this.character();
    if (character && this.isLocalCharacter()) {
      this.router.navigate(['/characters', character.id, 'edit']);
    } else {
      this.snackBar.open('Apenas personagens criados localmente podem ser editados', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  protected onDelete() {
    const character = this.character();
    if (!character || !this.isLocalCharacter()) {
      this.snackBar.open('Apenas personagens criados localmente podem ser excluídos', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    const dialogData: DeleteConfirmationData = {
      title: 'Confirmar Exclusão',
      message: 'Tem certeza que deseja excluir este personagem?',
      itemName: character.name,
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar',
    };

    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteCharacter(character.id);
      }
    });
  }

  private deleteCharacter(characterId: number): void {
    const success = this.store.deleteCharacter(characterId);

    if (success) {
      this.snackBar.open('Personagem excluído com sucesso!', 'Fechar', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });

      // Redireciona para a lista
      this.router.navigate(['/characters']);
    } else {
      this.snackBar.open('Erro ao excluir personagem. Tente novamente.', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  protected getStatusClass(status: string): string {
    switch (status) {
      case 'Alive':
        return 'text-green-600';
      case 'Dead':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }
}
