import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  buffer,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Subject,
  takeUntil,
} from 'rxjs';
import { SourceCodeMock } from './constants/code.mock';
import { Interpreter, Lexer, Parser } from './language';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  editorControl = new FormControl('');
  consoleOutput = '';
  editorLinesCount = 0;

  ngOnInit(): void {
    this.editorControl.valueChanges
      .pipe(filter(Boolean), distinctUntilChanged(), debounceTime(1500))
      .subscribe((value) => this.runCode(value));

    this.editorControl.valueChanges
      .pipe(
        debounceTime(300),
        map((value) => (value || '').split('\n').length)
      )
      .subscribe((count) => (this.editorLinesCount = count));

    const code = this.trimCode(SourceCodeMock);
    this.editorControl.setValue(code);
  }

  private runCode(code: string): void {
    const lexer = new Lexer();
    const parser = new Parser();
    const interpreter = new Interpreter();

    merge(lexer.error$, parser.error$, interpreter.error$).subscribe(
      (error) => (this.consoleOutput = this.createErrorElement(error))
    );

    const finished$ = new Subject<void>();
    interpreter.logEvent$
      .pipe(takeUntil(finished$), buffer(finished$))
      .subscribe((logs = []) => (this.consoleOutput = logs.join('<br>')));

    const tokens = lexer.tokenize(code);

    console.log('Tokens: ', tokens);

    const ast = parser.parse(tokens);

    console.log('AST: ', ast);

    interpreter.execute(ast);

    finished$.next();
    finished$.complete();
  }

  private trimCode(code: string): string {
    return code
      .trim()
      .split('\n')
      .map((line) => line.trim())
      .join('\n');
  }

  private createErrorElement(error: string): string {
    return `<span class="console__error">${error}</span>`;
  }
}
