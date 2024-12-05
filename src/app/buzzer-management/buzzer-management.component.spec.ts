import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuzzerManagementComponent } from './buzzer-management.component';

describe('BuzzerManagementComponent', () => {
  let component: BuzzerManagementComponent;
  let fixture: ComponentFixture<BuzzerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuzzerManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuzzerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
