export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: CharacterGender;
  origin: CharacterLocation;
  location: CharacterLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

/**
 * Status possíveis de um personagem na série
 */
export enum CharacterStatus {
  ALIVE = 'Alive',
  DEAD = 'Dead',
  UNKNOWN = 'unknown',
}

/**
 * Gêneros disponíveis para personagens
 */
export enum CharacterGender {
  FEMALE = 'Female',
  MALE = 'Male',
  GENDERLESS = 'Genderless',
  UNKNOWN = 'unknown',
}

/**
 * Representa uma localização (origem ou atual) do personagem
 */
export interface CharacterLocation {
  name: string;
  url: string;
}

/**
 * Resposta da API quando busca lista de personagens
 */
export interface CharacterApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

/**
 * Formulário para criação/edição de personagem
 */
export interface CharacterForm {
  name: string;
  status: CharacterStatus;
  species: string;
  gender: CharacterGender;
  type?: string;
}

/**
 * Filtros para busca de personagens
 */
export interface CharacterFilters {
  name?: string;
  status?: CharacterStatus;
  species?: string;
  gender?: CharacterGender;
  page?: number;
}
