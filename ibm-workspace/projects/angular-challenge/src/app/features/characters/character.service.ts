import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Character, CharacterApiResponse, CharacterFilters } from '.';

@Injectable()
export class CharacterService {
  private readonly apiUrl = 'https://rickandmortyapi.com/api/character';
  private readonly http = inject(HttpClient);

  /**
   * Busca lista de personagens com filtros opcionais
   */
  getCharacters(filters?: CharacterFilters): Observable<CharacterApiResponse> {
    const params = this.buildParams(filters);
    return this.http.get<CharacterApiResponse>(this.apiUrl, { params });
  }

  /**
   * Busca personagem por ID
   */
  getCharacterById(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/${id}`);
  }

  /**
   * Constrói parâmetros da query string
   */
  private buildParams(filters?: CharacterFilters): Record<string, string> {
    if (!filters) return {};

    const params: Record<string, string> = {};

    if (filters.name) params['name'] = filters.name;
    if (filters.status) params['status'] = filters.status;
    if (filters.species) params['species'] = filters.species;
    if (filters.gender) params['gender'] = filters.gender;
    if (filters.page) params['page'] = filters.page.toString();

    return params;
  }
}
