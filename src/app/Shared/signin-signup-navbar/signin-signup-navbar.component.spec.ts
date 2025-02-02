import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninSignupNavbarComponent } from './signin-signup-navbar.component';

describe('SigninSignupNavbarComponent', () => {
  let component: SigninSignupNavbarComponent;
  let fixture: ComponentFixture<SigninSignupNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigninSignupNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SigninSignupNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
