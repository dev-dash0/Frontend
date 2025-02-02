import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Forgetpassword4Component } from './forgetpassword4.component';

describe('Forgetpassword4Component', () => {
  let component: Forgetpassword4Component;
  let fixture: ComponentFixture<Forgetpassword4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forgetpassword4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Forgetpassword4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
