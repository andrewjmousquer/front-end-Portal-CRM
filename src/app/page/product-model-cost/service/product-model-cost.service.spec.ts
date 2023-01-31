import { TestBed } from '@angular/core/testing';

import { ProductModelCostService } from './product-model-cost.service';

describe('ProductModelCostService', () => {
  let service: ProductModelCostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductModelCostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
