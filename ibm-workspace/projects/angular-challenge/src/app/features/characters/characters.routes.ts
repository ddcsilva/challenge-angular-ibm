import { Routes } from '@angular/router';
import { CharacterService, CharacterStore } from '.';

export default [
  {
    path: '',
    providers: [CharacterService, CharacterStore],
    loadComponent: () => import('./components').then(m => m.CharacterListComponent),
  },
] as Routes;
