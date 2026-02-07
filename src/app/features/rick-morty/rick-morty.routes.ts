// rick-morty.routes.ts
import { Routes } from '@angular/router';
import { RickMortyPage } from './rick-morty.page';

export const RICK_MORTY_ROUTES: Routes = [
  {
    path: '',
    component: RickMortyPage,
  },
];
