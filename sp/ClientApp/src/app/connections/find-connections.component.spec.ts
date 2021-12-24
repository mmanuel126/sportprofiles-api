import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindConnectionsComponent } from './find-connections.component';

describe('FindConnectionsComponent', () => {
  let component: FindConnectionsComponent;
  let fixture: ComponentFixture<FindConnectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindConnectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
