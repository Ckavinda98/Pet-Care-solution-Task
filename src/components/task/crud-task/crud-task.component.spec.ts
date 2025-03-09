import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudTaskComponent } from './crud-task.component';

describe('CrudTaskComponent', () => {
  let component: CrudTaskComponent;
  let fixture: ComponentFixture<CrudTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
