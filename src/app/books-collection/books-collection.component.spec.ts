import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksCollectionComponent } from './books-collection.component';

describe('BooksCollectionComponent', () => {
  let component: BooksCollectionComponent;
  let fixture: ComponentFixture<BooksCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BooksCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
