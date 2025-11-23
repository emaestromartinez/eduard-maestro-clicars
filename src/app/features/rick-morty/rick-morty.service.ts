import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
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

        const firstEpisodes = characters.map((c) => c.episode?.[0]).filter(Boolean) as string[];
        const uniqueEpisodes = Array.from(new Set(firstEpisodes));

        const episodeRequests = uniqueEpisodes.map((url) => {
          const id = url.split('/').pop();
          return this.http
            .get<{ name: string }>(`https://rickandmortyapi.com/api/episode/${id}`)
            .pipe(map((ep) => ({ url, name: ep.name })));
        });

        return forkJoin(episodeRequests).pipe(
          map((episodesData) => {
            const episodeMap = new Map(episodesData.map((e) => [e.url, e.name]));

            const enriched = characters.map((char) => ({
              ...char,
              firstEpisodeName: char.episode?.[0]
                ? (episodeMap.get(char.episode[0]) ?? null)
                : null,
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
