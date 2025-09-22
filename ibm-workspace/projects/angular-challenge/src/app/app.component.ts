import { Component } from '@angular/core';
import { MainLayoutComponent } from './layout';

@Component({
  selector: 'ibm-root',
  standalone: true,
  imports: [MainLayoutComponent],
  template: ` <ibm-main-layout></ibm-main-layout> `,
})
export class AppComponent {}
