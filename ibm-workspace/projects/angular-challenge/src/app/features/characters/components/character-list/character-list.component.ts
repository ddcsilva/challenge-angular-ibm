import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CharacterStore } from '../../character.store';
import { CharacterStatus } from '../../character.model';

@Component({
  selector: 'ibm-character-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterListComponent implements OnInit {
  protected store = inject(CharacterStore);

  ngOnInit() {
    this.store.loadCharacters();
  }

  /**
   * Retorna classe CSS para status do personagem
   */
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
