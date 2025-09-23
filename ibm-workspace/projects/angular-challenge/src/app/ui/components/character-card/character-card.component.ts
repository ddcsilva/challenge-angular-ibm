import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Character, CharacterSpeciesPipe, CharacterStatusPipe } from '@features/index';

@Component({
  selector: 'ibm-character-card',
  standalone: true,
  imports: [MatCardModule, CharacterStatusPipe, CharacterSpeciesPipe],
  templateUrl: './character-card.component.html',
  styleUrl: './character-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterCardComponent {
  // Inputs
  character = input.required<Character>();

  // Outputs
  cardClick = output<number>();

  protected onCardClick() {
    this.cardClick.emit(this.character().id);
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
