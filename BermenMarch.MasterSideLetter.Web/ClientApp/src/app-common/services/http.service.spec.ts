import { TestBed, inject, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HttpService } from './http.service';

describe('HttpService', () => {
  let httpService: HttpService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [

      ]
    });

    const injector = getTestBed();

    httpTestingController = injector.get(HttpTestingController);
    httpService = injector.get(HttpService);
  });

  afterEach(() => httpTestingController.verify());

  it('should be created', inject([HttpService], (service: HttpService) => {
    expect(service).toBeTruthy();
  }));


  describe('get', () => {
    const URL = 'http://example.com';
    
  });
});
