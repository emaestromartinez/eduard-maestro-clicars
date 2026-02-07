import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Eduard Maestro - Portfolio',
    loadComponent: () =>
      import('./features/eduard-maestro/eduard-maestro.page').then((m) => m.EduardMaestroPage),
  },
  {
    path: 'rick-morty',
    title: 'Rick & Morty',
    loadComponent: () =>
      import('./features/rick-morty/rick-morty.page').then((m) => m.RickMortyPage),
  },

  // Opcional: wildcard para 404 o redirección
  { path: '**', redirectTo: '' },
];
