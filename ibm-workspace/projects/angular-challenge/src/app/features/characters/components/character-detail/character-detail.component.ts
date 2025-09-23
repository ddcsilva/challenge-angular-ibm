import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Character, CharacterService } from '@features/characters';
import { CharacterSpeciesPipe, CharacterStatusPipe, CharacterGenderPipe } from '@features/pipes';

@Component({
  selector: 'ibm-character-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    CharacterStatusPipe,
    CharacterSpeciesPipe,
    CharacterGenderPipe,
  ],
  templateUrl: './character-detail.component.html',
  styleUrl: './character-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterDetailComponent implements OnInit {
  private characterService = inject(CharacterService);
  private router = inject(Router);

  // Input da rota
  id = input.required<number>();

  // Estado local
  character = signal<Character | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadCharacter();
  }

  private loadCharacter() {
    this.loading.set(true);
    this.error.set(null);

    this.characterService.getCharacterById(this.id()).subscribe({
      next: character => {
        this.character.set(character);
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
    // TODO: Implementar na próxima etapa
    console.log('Editar personagem:', this.character()?.id);
  }

  protected onDelete() {
    // TODO: Implementar na próxima etapa
    console.log('Excluir personagem:', this.character()?.id);
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
