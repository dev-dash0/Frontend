import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Forgetpassword3Component } from './forgetpassword3.component';

describe('Forgetpassword3Component', () => {
  let component: Forgetpassword3Component;
  let fixture: ComponentFixture<Forgetpassword3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forgetpassword3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Forgetpassword3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
