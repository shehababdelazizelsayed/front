import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSec } from './hero-sec';

describe('HeroSec', () => {
  let component: HeroSec;
  let fixture: ComponentFixture<HeroSec>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeroSec]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroSec);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
