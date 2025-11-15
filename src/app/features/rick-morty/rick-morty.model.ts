export interface RMCharacterLocation {
  name: string;
  url: string;
}

export interface RMCharacterOrigin {
  name: string;
  url: string;
}

export interface RMCharacter {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: RMCharacterOrigin;
  location: RMCharacterLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}
