import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { VERSION as ANGULAR_VERSION } from '@angular/core';

@Component({
  selector: 'ibm-main-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive, MatToolbarModule, MatButtonModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {
  readonly angularVersion = ANGULAR_VERSION.major;
  readonly logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Rick_and_Morty.svg';
  readonly apiUrl = 'https://rickandmortyapi.com';
}
