import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RickMortyService } from './rick-morty.service';
import { CharacterCardComponent } from './components/character-card/character-card.component';
import { RMCharacter } from './rick-morty.model';

@Component({
  selector: 'app-rick-morty-page',
  standalone: true,
  imports: [CommonModule, CharacterCardComponent],
  templateUrl: './rick-morty.page.html',
  styleUrls: ['./rick-morty.page.scss'],
})
export class RickMortyPage {
  loading = signal(true);
  characters = signal<RMCharacter[]>([]);
  error = signal<string | null>(null);

  constructor(private svc: RickMortyService) {
    this.loadCharacters();
  }

  private async loadCharacters() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const res = await this.svc.getFiveCharacters();
      this.characters.set(res);
    } catch (err) {
      this.error.set('Error cargando personajes');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }
}
