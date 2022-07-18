import { Subject } from 'rxjs';
import { Token } from './token';

export class ErrorProducer {
  private errorSubject = new Subject<string>();

  error$ = this.errorSubject.asObservable();

  protected throwError(error: string, token: Token | null = null): never {
    let message = error;

    if (token !== null) {
      message += ` on line ${token.line} char ${token.char}`;
      message += ` value "${token.value}"`;
    }

    this.errorSubject.next(message);
    throw new SyntaxError(message);
  }
}
