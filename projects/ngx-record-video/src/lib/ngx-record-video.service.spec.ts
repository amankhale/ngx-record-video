import { TestBed } from '@angular/core/testing';

import { NgxRecordVideoService } from './ngx-record-video.service';

describe('NgxRecordVideoService', () => {
  let service: NgxRecordVideoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxRecordVideoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
