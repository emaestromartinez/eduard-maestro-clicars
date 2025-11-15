import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RickMortyPage } from './rick-morty.page';
import { RickMortyService } from './rick-morty.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import {
  RMCharacter,
  RMCharacterResponse,
  RMCharacterStatus,
  RMCharacterLocation,
} from './rick-morty.model';
import { CharacterCardComponent } from './components/character-card/character-card.component';
import { Signal } from '@angular/core';

describe('RickMortyPage', () => {
  let component: RickMortyPage;
  let fixture: ComponentFixture<RickMortyPage>;
  let svc: RickMortyService;

  const mockCharacters: RMCharacter[] = [
    {
      id: 1,
      name: 'Rick',
      status: RMCharacterStatus.Alive,
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'mockName', url: 'empty' },
      location: { name: 'mockName', url: 'empty' },
      image: '',
      episode: [],
      url: '',
      created: '',
    },
    {
      id: 2,
      name: 'Morty',
      status: RMCharacterStatus.Alive,
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'mockName', url: 'empty' },
      location: { name: 'mockName', url: 'empty' },
      image: '',
      episode: [],
      url: '',
      created: '',
    },
  ];

  const mockResponse: RMCharacterResponse = {
    info: { count: 2, pages: 1, next: null, prev: null },
    results: mockCharacters,
  };

  beforeEach(waitForAsync(() => {
    const svcMock = {
      getCharacters: jasmine.createSpy('getCharacters').and.returnValue(of(mockResponse)),
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CharacterCardComponent],
      providers: [{ provide: RickMortyService, useValue: svcMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(RickMortyPage);
    component = fixture.componentInstance;
    svc = TestBed.inject(RickMortyService);
    fixture.detectChanges();
  }));

  afterEach(() => {
    sessionStorage.clear();
    sessionStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should restore filters from sessionStorage', () => {
    sessionStorage.setItem('rmFilters', JSON.stringify({ name: 'Rick' }));
    const newComp = TestBed.createComponent(RickMortyPage).componentInstance;
    expect(newComp.filters()).toEqual({ name: 'Rick' });
  });

  it('should restore pagination from sessionStorage', () => {
    sessionStorage.setItem('apiPage', '3');
    sessionStorage.setItem('subPage', '2');
    const newComp = TestBed.createComponent(RickMortyPage).componentInstance;
    expect(newComp.apiPage()).toBe(3);
    expect(newComp.subPage()).toBe(2);
  });

  it('applyFilters should update filters and reset pages', () => {
    component.filterForm.setValue({ name: 'Morty', status: '', gender: '' });
    component.applyFilters();
    expect(component.filters()).toEqual({ name: 'Morty', status: '', gender: '' });
    expect(component.apiPage()).toBe(1);
    expect(component.subPage()).toBe(1);
  });

  it('nextPage should increment subPage or apiPage', () => {
    component.subPage.set(1);
    component.nextPage();
    expect(component.subPage()).toBe(2);

    component.subPage.set(4); // max subpage = 4
    component.nextPage();
    expect(component.subPage()).toBe(1);
    expect(component.apiPage()).toBe(2);
  });

  it('prevPage should decrement subPage or apiPage', () => {
    component.subPage.set(2);
    component.prevPage();
    expect(component.subPage()).toBe(1);

    component.subPage.set(1);
    component.apiPage.set(2);
    component.prevPage();
    expect(component.subPage()).toBe(4);
    expect(component.apiPage()).toBe(1);
  });

  it('globalPage should compute correct page', () => {
    component.apiPage.set(2);
    component.subPage.set(3);
    expect(component.globalPage()).toBe(7); // (2-1)*4 + 3
  });

  it('should fetch characters from service', (done) => {
    // characters es una señal
    const chars = component.characters?.();
    expect(chars).toBeTruthy();
    expect(chars!.length).toBeGreaterThan(0);
    expect(svc.getCharacters).toHaveBeenCalled();
    done();
  });
});
