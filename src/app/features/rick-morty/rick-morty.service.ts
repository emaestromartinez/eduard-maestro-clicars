import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RMCharacter, RMCharacterResponse } from './rick-morty.model';

@Injectable({ providedIn: 'root' })
export class RickMortyService {
  private BASE_URL = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) {}

  getCharacters(
    page: number = 1,
    filters?: Record<string, string | null>,
  ): Observable<RMCharacterResponse> {
    let params = new HttpParams().set('page', page.toString());

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params = params.set(key, value);
      });
    }

    return this.http.get<RMCharacterResponse>(this.BASE_URL, { params });
  }
}
