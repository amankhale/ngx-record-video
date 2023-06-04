import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxRecordVideoComponent } from './ngx-record-video.component';

describe('NgxRecordVideoComponent', () => {
  let component: NgxRecordVideoComponent;
  let fixture: ComponentFixture<NgxRecordVideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgxRecordVideoComponent]
    });
    fixture = TestBed.createComponent(NgxRecordVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
