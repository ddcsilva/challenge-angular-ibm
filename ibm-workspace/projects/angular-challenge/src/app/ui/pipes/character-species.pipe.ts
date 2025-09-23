import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'characterSpecies',
  standalone: true,
})
export class CharacterSpeciesPipe implements PipeTransform {
  private readonly speciesMap: Record<string, string> = {
    Human: 'Humano',
    Humanoid: 'Humanoide',
    Alien: 'Alienígena',
    Robot: 'Robô',
    Cronenberg: 'Cronenberg',
    Animal: 'Animal',
    Disease: 'Doença',
    Poopybutthole: 'Poopybutthole',
    'Mythological Creature': 'Criatura Mitológica',
    unknown: 'Desconhecido',
  };

  transform(species: string): string {
    if (!species) return 'Desconhecido';

    // Verifica se existe tradução
    if (this.speciesMap[species]) {
      return this.speciesMap[species];
    }

    // Se não encontrar, formata primeira letra maiúscula
    return species.charAt(0).toUpperCase() + species.slice(1).toLowerCase();
  }
}
