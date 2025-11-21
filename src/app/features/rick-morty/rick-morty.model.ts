export interface RMInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface RMCharacterLocation {
  name: string;
  url: string;
}

export interface RMCharacter {
  id: number;
  name: string;
  status: RMCharacterStatus;
  species: string;
  type: string;
  gender: string;
  origin: RMCharacterLocation;
  location: RMCharacterLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}
export interface RMCharacterWithEpisode extends RMCharacter {
  firstEpisodeName?: string | null;
}

export interface RMCharacterResponse {
  info: RMInfo;
  results: RMCharacter[];
}

export enum RMCharacterGender {
  Female = 'female',
  Male = 'male',
  Genderless = 'genderless',
  Unknown = 'unknown',
}

export enum RMCharacterStatus {
  Alive = 'Alive',
  Dead = 'Dead',
  Unknown = 'unknown',
}

export const STATUS_COLOR: Record<RMCharacterStatus, string> = {
  [RMCharacterStatus.Alive]: '#55cc44',
  [RMCharacterStatus.Dead]: '#d63d2e',
  [RMCharacterStatus.Unknown]: '#9e9e9e',
};
