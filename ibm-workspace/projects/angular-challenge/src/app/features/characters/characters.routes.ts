import { Routes } from '@angular/router';
import { CharacterService } from './character.service';
import { CharacterStore } from './character.store';

export default [
  {
    path: '',
    providers: [CharacterService, CharacterStore],
    loadComponent: () =>
      import('./components/character-list/character-list.component').then(m => m.CharacterListComponent),
  },
] as Routes;
