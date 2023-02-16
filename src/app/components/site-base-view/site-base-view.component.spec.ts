import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteBaseViewComponent } from './site-base-view.component';

describe('SiteBaseViewComponent', () => {
  let component: SiteBaseViewComponent;
  let fixture: ComponentFixture<SiteBaseViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SiteBaseViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteBaseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
