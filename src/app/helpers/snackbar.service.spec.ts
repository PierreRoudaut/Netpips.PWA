import { SnackbarOptions, SnackbarService } from './snackbar.service';

describe('SnackbarService', () => {
  let open: jasmine.Spy;
  let service: SnackbarService;

  beforeEach(() => {
    open = jasmine.createSpy('open');
    service = new SnackbarService({ open } as any);
  });

  it('info opens an info toast for 3 seconds', () => {
    service.info('hello');
    expect(open).toHaveBeenCalledWith('hello', 'OK', { duration: 3000, panelClass: 'toast-info' });
  });

  it('warn opens a warn toast', () => {
    service.warn('oops');
    expect(open).toHaveBeenCalledWith('oops', 'OK', { duration: 3000, panelClass: 'toast-warn' });
  });

  it('warn falls back to a default message', () => {
    service.warn('');
    expect(open.calls.mostRecent().args[0]).toBe('An error occured');
  });

  it('show uses the provided options', () => {
    service.show(new SnackbarOptions({ text: 'custom', duration: 10 }));
    expect(open).toHaveBeenCalledWith('custom', 'OK', { duration: 10 });
  });
});

describe('SnackbarOptions', () => {
  it('applies defaults', () => {
    const options = new SnackbarOptions({});
    expect(options.text).toBe('Default text');
    expect(options.duration).toBe(5000);
  });
});
