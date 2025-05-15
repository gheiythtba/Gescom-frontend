import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonDeTransfertComponent } from './bon-de-transfert.component';

describe('BonDeTransfertComponent', () => {
  let component: BonDeTransfertComponent;
  let fixture: ComponentFixture<BonDeTransfertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonDeTransfertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonDeTransfertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
