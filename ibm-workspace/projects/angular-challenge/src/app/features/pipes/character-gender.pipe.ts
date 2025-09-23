import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'characterGender',
  standalone: true,
})
export class CharacterGenderPipe implements PipeTransform {
  private readonly genderMap: Record<string, string> = {
    Male: 'Masculino',
    Female: 'Feminino',
    Genderless: 'Sem gênero',
    unknown: 'Desconhecido',
  };

  transform(gender: string): string {
    if (!gender) return 'Desconhecido';

    return this.genderMap[gender] || gender;
  }
}
