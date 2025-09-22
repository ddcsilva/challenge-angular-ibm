import { Routes } from '@angular/router';
import { CharacterService } from './character.service';

export default [
  {
    path: '',
    providers: [CharacterService],
    loadComponent: () =>
      import('./components/character-list/character-list.component').then(m => m.CharacterListComponent),
  },
] as Routes;
