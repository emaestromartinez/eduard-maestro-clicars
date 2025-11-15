import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    sessionStorage.clear();
    document.body.className = '';
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize darkMode from sessionStorage', () => {
    sessionStorage.setItem('darkMode', 'true');
    const newService = TestBed.inject(ThemeService);

    expect(newService.darkMode()).toBeTrue();
  });

  it('should initialize darkMode from prefers-color-scheme if sessionStorage empty', () => {
    spyOn(window, 'matchMedia').and.returnValue({
      matches: true,
      addListener: () => {},
      removeListener: () => {},
    } as unknown as MediaQueryList);

    const newService = TestBed.inject(ThemeService);
    expect(newService.darkMode()).toBeTrue();
  });

  it('toggleDarkMode should invert darkMode and save to sessionStorage', () => {
    service.darkMode.set(false);
    service.toggleDarkMode();
    expect(service.darkMode()).toBeTrue();
    expect(JSON.parse(sessionStorage.getItem('darkMode')!)).toBeTrue();

    service.toggleDarkMode();
    expect(service.darkMode()).toBeFalse();
    expect(JSON.parse(sessionStorage.getItem('darkMode')!)).toBeFalse();
  });
});
