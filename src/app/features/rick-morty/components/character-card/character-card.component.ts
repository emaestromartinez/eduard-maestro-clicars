import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RMCharacter } from '../../rick-morty.model';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
})
export class CharacterCardComponent {
  @Input() character!: RMCharacter;
}
