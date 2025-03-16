import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupCodeComponent } from './backup-code.component';

describe('BackupCodeComponent', () => {
  let component: BackupCodeComponent;
  let fixture: ComponentFixture<BackupCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackupCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackupCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
