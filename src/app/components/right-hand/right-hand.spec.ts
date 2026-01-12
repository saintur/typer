import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightHand } from './right-hand';

describe('RightHand', () => {
  let component: RightHand;
  let fixture: ComponentFixture<RightHand>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightHand]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RightHand);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
