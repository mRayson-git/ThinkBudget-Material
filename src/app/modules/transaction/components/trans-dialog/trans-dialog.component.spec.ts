import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransDialogComponent } from './trans-dialog.component';

describe('TransDialogComponent', () => {
  let component: TransDialogComponent;
  let fixture: ComponentFixture<TransDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
