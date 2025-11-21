import { Component, Input } from '@angular/core';
import { RMCharacterStatus, RMCharacterWithEpisode, STATUS_COLOR } from '../../rick-morty.model';

@Component({
  selector: 'app-character-card',
  standalone: true,
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
})
export class CharacterCardComponent {
  @Input() character!: RMCharacterWithEpisode;

  CharacterStatus = RMCharacterStatus; // para usar en el template
  STATUS_COLOR = STATUS_COLOR;
}
