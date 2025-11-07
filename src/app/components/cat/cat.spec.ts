import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cat } from './cat';

describe('Cat', () => {
  let component: Cat;
  let fixture: ComponentFixture<Cat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Cat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
