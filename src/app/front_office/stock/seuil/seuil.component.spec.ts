import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeuilComponent } from './seuil.component';

describe('SeuilComponent', () => {
  let component: SeuilComponent;
  let fixture: ComponentFixture<SeuilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeuilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeuilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
