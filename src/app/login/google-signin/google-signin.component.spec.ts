import { ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { GoogleSignInComponent } from './google-signin.component';

describe('GoogleSignInComponent', () => {
  let fixture: ComponentFixture<GoogleSignInComponent>;
  let initialize: jasmine.Spy;
  let renderButton: jasmine.Spy;

  beforeEach(() => {
    initialize = jasmine.createSpy('initialize');
    renderButton = jasmine.createSpy('renderButton');
    TestBed.configureTestingModule({ declarations: [GoogleSignInComponent] });
    fixture = TestBed.createComponent(GoogleSignInComponent);
    fixture.componentInstance.clientId = 'client-id';
  });

  afterEach(() => delete (window as any).google);

  it('renders the button and emits the credential once Google is loaded', () => {
    (window as any).google = { accounts: { id: { initialize, renderButton } } };
    const emitted: string[] = [];
    fixture.componentInstance.googleSignInSuccess.subscribe((t: string) => emitted.push(t));

    fixture.detectChanges();

    expect(initialize).toHaveBeenCalled();
    expect(initialize.calls.mostRecent().args[0].client_id).toBe('client-id');
    expect(renderButton).toHaveBeenCalledWith(fixture.nativeElement, jasmine.objectContaining({ width: 240, type: 'standard' }));

    initialize.calls.mostRecent().args[0].callback({ credential: 'jwt' });
    expect(emitted).toEqual(['jwt']);
  });

  it('waits until the Google script has loaded', fakeAsync(() => {
    fixture.detectChanges();
    tick(300);
    expect(initialize).not.toHaveBeenCalled();

    (window as any).google = { accounts: { id: { initialize, renderButton } } };
    tick(100);
    expect(renderButton).toHaveBeenCalled();
    discardPeriodicTasks();
  }));

  it('stops polling when destroyed', fakeAsync(() => {
    fixture.detectChanges();
    fixture.destroy();
    (window as any).google = { accounts: { id: { initialize, renderButton } } };
    tick(1000);
    expect(initialize).not.toHaveBeenCalled();
  }));
});
