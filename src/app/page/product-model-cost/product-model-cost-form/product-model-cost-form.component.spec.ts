import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductModelCostFormComponent } from './product-model-cost-form.component';

describe('ProductModelCostFormComponent', () => {
  let component: ProductModelCostFormComponent;
  let fixture: ComponentFixture<ProductModelCostFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductModelCostFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductModelCostFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
