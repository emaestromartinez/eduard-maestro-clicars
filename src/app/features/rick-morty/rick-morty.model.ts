export type RMCharacter = {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: string[];
  url: string;
  created: string;
};

/* Enum para el estado del personaje */
export enum CharacterStatus {
  Alive = 'Alive',
  Dead = 'Dead',
  Unknown = 'unknown',
}

/* Función de ayuda para obtener color según status */
export const STATUS_COLOR: Record<CharacterStatus, string> = {
  [CharacterStatus.Alive]: '#55cc44',
  [CharacterStatus.Dead]: '#d63d2e',
  [CharacterStatus.Unknown]: '#9e9e9e',
};
