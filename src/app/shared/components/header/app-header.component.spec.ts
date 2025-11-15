import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppHeaderComponent } from './app-header.component';
import { ThemeService } from '../../theme/theme.service';

describe('AppHeaderComponent', () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;
  let themeService: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    const themeSpy = jasmine.createSpyObj('ThemeService', ['toggleDarkMode', 'darkMode']);

    await TestBed.configureTestingModule({
      imports: [AppHeaderComponent],
      providers: [{ provide: ThemeService, useValue: themeSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call theme.toggleDarkMode when toggleDarkMode is called', () => {
    component.toggleDarkMode();
    expect(themeService.toggleDarkMode).toHaveBeenCalled();
  });

  it('should display "Modo Oscuro" when darkMode returns false', () => {
    themeService.darkMode.and.returnValue(false);
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.header__toggle');
    expect(button.textContent?.trim()).toBe('Modo Oscuro');
  });

  it('should display "Modo Claro" when darkMode returns true', () => {
    themeService.darkMode.and.returnValue(true);
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.header__toggle');
    expect(button.textContent?.trim()).toBe('Modo Claro');
  });

  it('should toggle dark mode when button is clicked', () => {
    themeService.darkMode.and.returnValue(false);
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.header__toggle');
    button.click();
    expect(themeService.toggleDarkMode).toHaveBeenCalled();
  });
});
