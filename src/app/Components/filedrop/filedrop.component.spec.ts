import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiledropComponent } from './filedrop.component';

describe('FiledropComponent', () => {
  let component: FiledropComponent;
  let fixture: ComponentFixture<FiledropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiledropComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiledropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
