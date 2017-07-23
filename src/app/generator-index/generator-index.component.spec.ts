import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratorIndexComponent } from './generator-index.component';

describe('GeneratorIndexComponent', () => {
  let component: GeneratorIndexComponent;
  let fixture: ComponentFixture<GeneratorIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneratorIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratorIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
