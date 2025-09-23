import { Routes } from '@angular/router';
import { CharacterService, CharacterStore, CharacterLocalStorageService } from '@features/characters';

export default [
  {
    path: '',
    providers: [CharacterService, CharacterStore, CharacterLocalStorageService],
    children: [
      {
        path: '',
        loadComponent: () => import('./components').then(m => m.CharacterListComponent),
      },
      {
        path: 'new',
        loadComponent: () => import('./components').then(m => m.CharacterCreateComponent),
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./components').then(m => m.CharacterEditComponent),
      },
      {
        path: ':id',
        loadComponent: () => import('./components').then(m => m.CharacterDetailComponent),
      },
    ],
  },
] as Routes;
