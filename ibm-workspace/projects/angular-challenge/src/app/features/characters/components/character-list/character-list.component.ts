import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ibm-character-list',
  standalone: true,
  imports: [],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterListComponent {}
