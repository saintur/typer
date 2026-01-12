import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftHand } from './left-hand';

describe('LeftHand', () => {
  let component: LeftHand;
  let fixture: ComponentFixture<LeftHand>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftHand]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftHand);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
