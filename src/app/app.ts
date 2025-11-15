import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from './shared/components/header/app-header.component';
import { ThemeService } from './shared/theme/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, AppHeaderComponent],
  providers: [ThemeService],
  templateUrl: './app.html',
})
export class AppComponent {}
