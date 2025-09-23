import { ChangeDetectionStrategy, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { CharacterStore, Character } from '@features/characters';
import { Router } from '@angular/router';
import { CharacterCardComponent } from '@ui/components/character-card/character-card.component';

@Component({
  selector: 'ibm-character-list',
  standalone: true,
  imports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CharacterCardComponent,
  ],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterListComponent implements OnInit, OnDestroy {
  protected store = inject(CharacterStore);
  protected router = inject(Router);
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.store.loadCharacters();

    this.searchSubject.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe(searchTerm => {
      this.store.searchCharacters(searchTerm);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onCharacterCardClick(characterId: number) {
    this.router.navigate(['/characters', characterId]);
  }

  protected onCreateCharacter() {
    this.router.navigate(['/characters/new']);
  }

  protected onSearchChange(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }

  protected onClearSearch() {
    this.store.clearSearch();
  }

  protected trackByCharacterId = (index: number, character: Character): number => character.id;
}
