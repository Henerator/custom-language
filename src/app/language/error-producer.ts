import { Subject } from 'rxjs';

export class ErrorProducer {
  private errorSubject = new Subject<string>();

  error$ = this.errorSubject.asObservable();

  protected throwError(error: string): never {
    this.errorSubject.next(error);
    throw new SyntaxError(error);
  }
}
