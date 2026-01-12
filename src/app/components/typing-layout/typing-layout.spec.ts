import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypingLayout } from './typing-layout';

describe('TypingLayout', () => {
  let component: TypingLayout;
  let fixture: ComponentFixture<TypingLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypingLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypingLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
