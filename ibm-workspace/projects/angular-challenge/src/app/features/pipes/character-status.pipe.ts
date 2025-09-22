import { Pipe, PipeTransform } from '@angular/core';
import { CharacterStatus } from '../characters';

@Pipe({
  name: 'characterStatus',
  standalone: true,
})
export class CharacterStatusPipe implements PipeTransform {
  private readonly statusMap = {
    [CharacterStatus.ALIVE]: 'Vivo',
    [CharacterStatus.DEAD]: 'Morto',
    [CharacterStatus.UNKNOWN]: 'Desconhecido',
  };

  transform(status: CharacterStatus): string {
    return this.statusMap[status] || status;
  }
}
