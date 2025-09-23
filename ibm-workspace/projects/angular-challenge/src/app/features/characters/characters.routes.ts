import { Routes } from '@angular/router';
import { CharacterService, CharacterStore } from '.';

export default [
  {
    path: '',
    providers: [CharacterService, CharacterStore],
    children: [
      {
        path: '',
        loadComponent: () => import('./components').then(m => m.CharacterListComponent),
      },
      {
        path: ':id',
        loadComponent: () => import('./components').then(m => m.CharacterDetailComponent),
      },
    ],
  },
] as Routes;
