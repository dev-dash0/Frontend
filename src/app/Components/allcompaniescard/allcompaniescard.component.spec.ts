import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllcompaniescardComponent } from './allcompaniescard.component';

describe('AllcompaniescardComponent', () => {
  let component: AllcompaniescardComponent;
  let fixture: ComponentFixture<AllcompaniescardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllcompaniescardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllcompaniescardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
