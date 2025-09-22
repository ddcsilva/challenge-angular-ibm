import { ChangeDetectionStrategy, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { CharacterStore, CharacterStatus } from '../..';
import { CharacterStatusPipe, CharacterSpeciesPipe } from '../../../pipes';

@Component({
  selector: 'ibm-character-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CharacterStatusPipe,
    CharacterSpeciesPipe,
  ],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterListComponent implements OnInit, OnDestroy {
  protected store = inject(CharacterStore);

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.store.loadCharacters();

    // Setup debounce para busca
    this.searchSubject.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe(searchTerm => {
      this.store.searchCharacters(searchTerm);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onSearchChange(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }

  protected onClearSearch() {
    this.store.clearSearch();
  }

  protected getStatusClass(status: CharacterStatus): string {
    switch (status) {
      case CharacterStatus.ALIVE:
        return 'text-green-600';
      case CharacterStatus.DEAD:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }
}
