import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, of } from 'rxjs';
import { switchMap, tap, map, catchError } from 'rxjs/operators';
import {
  RMCharacter,
  RMCharacterGender,
  RMCharacterResponse,
  RMCharacterStatus,
} from './rick-morty.model';
import { RickMortyService } from './rick-morty.service';
import { CharacterCardComponent } from './components/character-card/character-card.component';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CharacterCardComponent],
  templateUrl: './rick-morty.page.html',
  styleUrls: ['./rick-morty.page.scss'],
})
export class RickMortyPage {
  // ------------------------------
  // Signals de estado
  // ------------------------------
  apiPage = signal(1);
  subPage = signal(1);
  filters = signal<Record<string, string | null>>({});

  loading = signal(false);
  error = signal<string | null>(null);
  totalChunks = signal(1);

  readonly chunkSize = 5;
  readonly itemsPerApiPage = 20;

  // ------------------------------
  // Reactive Form
  // ------------------------------
  filterForm: FormGroup;

  statusOptions = Object.values(RMCharacterStatus);
  genderOptions = Object.values(RMCharacterGender);

  constructor(
    private svc: RickMortyService,
    private fb: FormBuilder,
  ) {
    // Crear el FormGroup
    this.filterForm = this.fb.group({
      name: [''],
      status: [''],
      gender: [''],
    });

    // Restaurar filtros desde sessionStorage
    const savedFilters = sessionStorage.getItem('rmFilters');
    if (savedFilters) {
      const parsed = JSON.parse(savedFilters);
      this.filters.set(parsed);
      this.filterForm.patchValue(parsed);
    }

    // Guardar cambios de filtros automáticamente
    effect(() => {
      sessionStorage.setItem('rmFilters', JSON.stringify(this.filters()));
    });

    // Restaurar paginación desde localStorage
    const savedApiPage = localStorage.getItem('apiPage');
    const savedSubPage = localStorage.getItem('subPage');
    if (savedApiPage) this.apiPage.set(Number(savedApiPage));
    if (savedSubPage) this.subPage.set(Number(savedSubPage));

    // Guardar cambios de paginación en localStorage
    effect(() => {
      localStorage.setItem('apiPage', this.apiPage().toString());
      localStorage.setItem('subPage', this.subPage().toString());
    });
  }

  // ------------------------------
  // Observables para combinar
  // ------------------------------
  private apiPage$ = toObservable(this.apiPage);
  private subPage$ = toObservable(this.subPage);
  private filters$ = toObservable(this.filters);

  // ------------------------------
  // Stream principal: personajes
  // ------------------------------
  private charactersStream$ = combineLatest([this.apiPage$, this.subPage$, this.filters$]).pipe(
    tap(() => {
      this.loading.set(true);
      this.error.set(null);
    }),
    switchMap(([apiPage, subPage, filters]) =>
      this.svc.getCharacters(apiPage, filters).pipe(
        tap((res: RMCharacterResponse) => {
          this.totalChunks.set(Math.ceil(res.info.count / this.chunkSize));
        }),
        map((res: RMCharacterResponse) => {
          const globalIndex = (subPage - 1) * this.chunkSize;
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
  // Página global
  // ------------------------------
  globalPage = computed(() => {
    return (this.apiPage() - 1) * (this.itemsPerApiPage / this.chunkSize) + this.subPage();
  });

  // ------------------------------
  // Paginación
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

  // ------------------------------
  // Aplicar filtros desde el Reactive Form
  // ------------------------------
  applyFilters() {
    const f: Record<string, string | null> = this.filterForm.value;
    this.filters.set(f);
    this.apiPage.set(1);
    this.subPage.set(1);
  }
}
