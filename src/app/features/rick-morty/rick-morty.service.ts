import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { RMCharacterResponse, RMCharacterWithEpisode } from './rick-morty.model';

@Injectable({ providedIn: 'root' })
export class RickMortyService {
  private BASE_URL = 'https://rickandmortyapi.com/api/character';

  private http = inject(HttpClient);

  getCharacters(
    page = 1,
    filters?: Record<string, string | null>,
  ): Observable<RMCharacterResponse & { results: RMCharacterWithEpisode[] }> {
    let params = new HttpParams().set('page', page.toString());

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params = params.set(key, value);
      });
    }

    return this.http.get<RMCharacterResponse>(this.BASE_URL, { params }).pipe(
      switchMap((res) => {
        const characters = res.results;

        const episodeRequests = characters.map((char) => {
          const firstUrl = char.episode?.[0];
          if (!firstUrl) return of(null);

          const id = firstUrl.split('/').pop();
          return this.http.get<{ name: string }>(`https://rickandmortyapi.com/api/episode/${id}`);
        });

        return forkJoin(episodeRequests).pipe(
          map((episodes) => {
            const enriched = characters.map((char, i) => ({
              ...char,
              firstEpisodeName: episodes[i]?.name ?? null,
            }));

            return {
              ...res,
              results: enriched,
            };
          }),
        );
      }),
    );
  }
}
