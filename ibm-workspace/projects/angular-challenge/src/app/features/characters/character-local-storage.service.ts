import { Injectable } from '@angular/core';
import { Character, CharacterForm } from './character.model';

@Injectable()
export class CharacterLocalStorageService {
  private readonly STORAGE_KEY = 'rick-morty-local-characters';
  private readonly COUNTER_KEY = 'rick-morty-character-counter';

  /**
   * Obtém todos os personagens criados localmente
   */
  getLocalCharacters(): Character[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Erro ao carregar personagens do localStorage:', error);
      return [];
    }
  }

  /**
   * Salva um novo personagem no localStorage
   */
  saveCharacter(characterForm: CharacterForm): Character {
    const characters = this.getLocalCharacters();
    const newId = this.generateId();

    const newCharacter: Character = {
      id: newId,
      name: characterForm.name,
      status: characterForm.status,
      species: characterForm.species,
      type: characterForm.type || '',
      gender: characterForm.gender,
      origin: {
        name: 'Local Creation',
        url: '',
      },
      location: {
        name: 'Local Storage',
        url: '',
      },
      image: this.generatePlaceholderImage(characterForm.name),
      episode: [],
      url: '',
      created: new Date().toISOString(),
    };

    characters.push(newCharacter);
    this.saveToStorage(characters);

    return newCharacter;
  }

  /**
   * Atualiza um personagem existente
   */
  updateCharacter(id: number, characterForm: CharacterForm): Character | null {
    const characters = this.getLocalCharacters();
    const index = characters.findIndex(char => char.id === id);

    if (index === -1) {
      return null;
    }

    const updatedCharacter: Character = {
      ...characters[index],
      name: characterForm.name,
      status: characterForm.status,
      species: characterForm.species,
      type: characterForm.type || '',
      gender: characterForm.gender,
    };

    characters[index] = updatedCharacter;
    this.saveToStorage(characters);

    return updatedCharacter;
  }

  /**
   * Remove um personagem do localStorage
   */
  deleteCharacter(id: number): boolean {
    const characters = this.getLocalCharacters();
    const filteredCharacters = characters.filter(char => char.id !== id);

    if (filteredCharacters.length === characters.length) {
      return false; // Personagem não encontrado
    }

    this.saveToStorage(filteredCharacters);
    return true;
  }

  /**
   * Verifica se um personagem foi criado localmente
   */
  isLocalCharacter(id: number): boolean {
    const characters = this.getLocalCharacters();
    return characters.some(char => char.id === id);
  }

  /**
   * Busca um personagem local por ID
   */
  getLocalCharacterById(id: number): Character | null {
    const characters = this.getLocalCharacters();
    return characters.find(char => char.id === id) || null;
  }

  /**
   * Limpa todos os personagens locais (para desenvolvimento/teste)
   */
  clearLocalCharacters(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.COUNTER_KEY);
  }

  /**
   * Exporta personagens locais como JSON
   */
  exportLocalCharacters(): string {
    const characters = this.getLocalCharacters();
    return JSON.stringify(characters, null, 2);
  }

  /**
   * Conta quantos personagens estão armazenados localmente
   */
  getLocalCharactersCount(): number {
    return this.getLocalCharacters().length;
  }

  private generateId(): number {
    // IDs locais começam em 10000 para evitar conflito com a API
    const MIN_LOCAL_ID = 10000;

    try {
      const currentCounter = localStorage.getItem(this.COUNTER_KEY);
      const counter = currentCounter ? parseInt(currentCounter, 10) : MIN_LOCAL_ID;
      const newId = counter + 1;

      localStorage.setItem(this.COUNTER_KEY, newId.toString());
      return newId;
    } catch (error) {
      console.warn('Erro ao gerar ID, usando timestamp:', error);
      return MIN_LOCAL_ID + Date.now();
    }
  }

  private generatePlaceholderImage(name: string): string {
    // Gera uma imagem de placeholder baseada no nome
    const encodedName = encodeURIComponent(name);
    const bgColor = this.generateColorFromName(name);
    const textColor = this.getContrastColor(bgColor);

    return `https://ui-avatars.com/api/?name=${encodedName}&size=300&background=${bgColor}&color=${textColor}&bold=true&format=png`;
  }

  private generateColorFromName(name: string): string {
    // Gera uma cor baseada no hash do nome
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const color = (hash & 0x00ffffff).toString(16).padStart(6, '0');
    return color.toUpperCase();
  }

  private getContrastColor(hexColor: string): string {
    // Calcula se deve usar texto claro ou escuro baseado na cor de fundo
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '000000' : 'FFFFFF';
  }

  private saveToStorage(characters: Character[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(characters));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
      throw new Error('Não foi possível salvar o personagem. Verifique se há espaço disponível.');
    }
  }
}
