import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../theme/theme.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent {
  pageTitle = 'Loading...'; // valor por defecto

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  theme = inject(ThemeService);

  constructor() {
    // Escuchamos solo los eventos de navegación completada
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.getRouteTitle(this.activatedRoute)),
      )
      .subscribe((title) => {
        this.pageTitle = title || 'Mi Aplicación';
      });
  }

  // Función auxiliar para obtener el título de la ruta activa (incluso con children)
  private getRouteTitle(route: ActivatedRoute): string | undefined {
    let child = route.firstChild;
    while (child) {
      if (child.snapshot.data['title'] || child.snapshot.title) {
        return child.snapshot.title as string;
      }
      if (child.firstChild) {
        child = child.firstChild;
      } else {
        break;
      }
    }
    return route.snapshot.title as string;
  }

  toggleDarkMode() {
    this.theme.toggleDarkMode();
  }
}
