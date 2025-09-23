import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainLayoutComponent } from './main-layout.component';
import { provideRouter } from '@angular/router';

describe('MainLayoutComponent', () => {
  let fixture: ComponentFixture<MainLayoutComponent>;
  let component: MainLayoutComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve expor a versão do Angular', () => {
    expect(component.angularVersion).toBeDefined();
    expect(typeof component.angularVersion).toBe('string');
  });

  it('deve ter a logoUrl correta', () => {
    expect(component.logoUrl).toBe('https://upload.wikimedia.org/wikipedia/commons/b/b1/Rick_and_Morty.svg');
  });

  it('deve ter a apiUrl correta', () => {
    expect(component.apiUrl).toBe('https://rickandmortyapi.com');
  });
});
