import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitItem } from './kit-item';

describe('KitItem', () => {
  let component: KitItem;
  let fixture: ComponentFixture<KitItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KitItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
