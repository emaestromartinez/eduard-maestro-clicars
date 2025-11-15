import { Routes } from '@angular/router';
import { RickMortyPage } from './features/rick-morty/rick-morty.page';

export const routes: Routes = [
  { path: '', redirectTo: 'rick-morty', pathMatch: 'full' },
  { path: 'rick-morty', component: RickMortyPage },
];
