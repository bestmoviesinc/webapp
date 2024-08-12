import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmscreenComponent } from './filmscreen.component';

describe('FilmscreenComponent', () => {
  let component: FilmscreenComponent;
  let fixture: ComponentFixture<FilmscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmscreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
