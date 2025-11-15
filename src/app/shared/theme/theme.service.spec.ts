import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.body.className = '';
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize darkMode from localStorage', () => {
    localStorage.setItem('darkMode', 'true');
    const newService = TestBed.inject(ThemeService);

    expect(newService.darkMode()).toBeTrue();
  });

  it('should initialize darkMode from prefers-color-scheme if localStorage empty', () => {
    spyOn(window, 'matchMedia').and.returnValue({
      matches: true,
      addListener: () => {},
      removeListener: () => {},
    } as unknown as MediaQueryList);

    const newService = TestBed.inject(ThemeService);
    expect(newService.darkMode()).toBeTrue();
  });

  it('toggleDarkMode should invert darkMode and save to localStorage', () => {
    service.darkMode.set(false);
    service.toggleDarkMode();
    expect(service.darkMode()).toBeTrue();
    expect(JSON.parse(localStorage.getItem('darkMode')!)).toBeTrue();

    service.toggleDarkMode();
    expect(service.darkMode()).toBeFalse();
    expect(JSON.parse(localStorage.getItem('darkMode')!)).toBeFalse();
  });
});
