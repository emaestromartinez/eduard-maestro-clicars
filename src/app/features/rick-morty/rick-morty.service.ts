import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RMCharacter } from './rick-morty.model';

@Injectable({ providedIn: 'root' })
export class RickMortyService {
  private base = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) {}

  /**
   * Obtener 5 personajes por ID (determinista para la prueba)
   */
  async getFiveCharacters(): Promise<RMCharacter[]> {
    try {
      const ids = [1, 2, 3, 4, 5];
      const url = `${this.base}/${ids.join(',')}`;
      const res = await firstValueFrom(this.http.get<RMCharacter | RMCharacter[]>(url));
      return Array.isArray(res) ? res : [res];
    } catch (error) {
      console.error('Error fetching Rick & Morty characters', error);
      throw new Error('No se pudieron cargar los personajes');
    }
  }
}
