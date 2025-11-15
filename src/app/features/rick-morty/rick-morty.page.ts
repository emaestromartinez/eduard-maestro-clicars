import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, tap, map, catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { RMCharacter, RMCharacterResponse } from './rick-morty.model';
import { RickMortyService } from './rick-morty.service';
import { CharacterCardComponent } from './components/character-card/character-card.component';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [CommonModule, CharacterCardComponent],
  templateUrl: './rick-morty.page.html',
  styleUrls: ['./rick-morty.page.scss'],
})
export class RickMortyPage {
  // ------------------------------
  // Signals de estado
  // ------------------------------
  apiPage = signal(1); // Página de la API (20 items)
  subPage = signal(1); // Subpágina interna (5 items)
  filters = signal<Record<string, string | null>>({});

  loading = signal(false);
  error = signal<string | null>(null);
  totalChunks = signal(1); // Total de subpáginas (5 en 5)
  readonly chunkSize = 5; // 5 por subpágina
  readonly itemsPerApiPage = 20; // Items que devuelve la API por página

  constructor(private svc: RickMortyService) {
    // ------------------------------
    // Restaurar desde localStorage si existen valores guardados
    // ------------------------------
    const savedApiPage = localStorage.getItem('apiPage');
    const savedSubPage = localStorage.getItem('subPage');
    const savedFilters = localStorage.getItem('filters');

    if (savedApiPage) this.apiPage.set(Number(savedApiPage));
    if (savedSubPage) this.subPage.set(Number(savedSubPage));
    if (savedFilters) this.filters.set(JSON.parse(savedFilters));

    // ------------------------------
    // Guardar automáticamente los cambios en localStorage
    // ------------------------------
    effect(() => {
      const apiPageVal = this.apiPage();
      const subPageVal = this.subPage();
      const filtersVal = this.filters();

      localStorage.setItem('apiPage', apiPageVal.toString());
      localStorage.setItem('subPage', subPageVal.toString());
      localStorage.setItem('filters', JSON.stringify(filtersVal));
    });
  }

  // ------------------------------
  // Conversión a observables
  // ------------------------------
  private apiPage$ = toObservable(this.apiPage);
  private subPage$ = toObservable(this.subPage);
  private filters$ = toObservable(this.filters);

  // ------------------------------
  // STREAM PRINCIPAL
  // ------------------------------
  private charactersStream$ = combineLatest([this.apiPage$, this.subPage$, this.filters$]).pipe(
    tap(() => {
      this.loading.set(true);
      this.error.set(null);
    }),
    switchMap(([apiPage, subPage, filters]) =>
      this.svc.getCharacters(apiPage, filters).pipe(
        tap((res: RMCharacterResponse) => {
          // Calculamos el total de subpáginas globales
          this.totalChunks.set(Math.ceil(res.info.count / this.chunkSize));
        }),
        map((res: RMCharacterResponse) => {
          // Índice global de inicio
          const globalIndex = (subPage - 1) * this.chunkSize;
          // Índice relativo a la página de la API
          const startInApiPage = globalIndex % res.results.length;
          return res.results.slice(startInApiPage, startInApiPage + this.chunkSize);
        }),
        catchError((err) => {
          console.error(err);
          this.error.set('Error cargando personajes');
          return of<RMCharacter[]>([]);
        }),
      ),
    ),
    tap(() => this.loading.set(false)),
  );

  characters = toSignal<RMCharacter[]>(this.charactersStream$, { requireSync: false });

  // ------------------------------
  // PÁGINA GLOBAL
  // ------------------------------
  globalPage = computed(() => {
    return (this.apiPage() - 1) * (this.itemsPerApiPage / this.chunkSize) + this.subPage();
  });

  // ------------------------------
  // PAGINACIÓN
  // ------------------------------
  nextPage() {
    const nextSubPage = this.subPage() + 1;
    const maxSubPage = this.itemsPerApiPage / this.chunkSize;

    if (nextSubPage > maxSubPage) {
      this.apiPage.update((p) => p + 1);
      this.subPage.set(1);
    } else {
      this.subPage.set(nextSubPage);
    }
  }

  prevPage() {
    if (this.subPage() > 1) {
      this.subPage.update((s) => s - 1);
      return;
    }

    if (this.apiPage() > 1) {
      this.apiPage.update((p) => p - 1);
      this.subPage.set(this.itemsPerApiPage / this.chunkSize);
    }
  }

  applyFilters(f: Record<string, string | null>) {
    this.filters.set(f);
    this.apiPage.set(1);
    this.subPage.set(1);
  }
}
