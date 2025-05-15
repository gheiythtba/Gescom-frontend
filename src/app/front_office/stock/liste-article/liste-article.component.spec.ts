import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeArticleComponent } from './liste-article.component';

describe('ListeArticleComponent', () => {
  let component: ListeArticleComponent;
  let fixture: ComponentFixture<ListeArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeArticleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
