import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () =>
      import('./components/character-list/character-list.component').then(m => m.CharacterListComponent),
  },
] as Routes;
