import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  buffer,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
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
    const tokens = lexer.tokenize(code);

    console.log('Tokens: ', tokens);

    const parser = new Parser();
    const ast = parser.parse(tokens);

    console.log(JSON.stringify(ast, null, 2));

    const interpreter = new Interpreter();

    const finished$ = new Subject<void>();

    interpreter.logEvent$
      .pipe(takeUntil(finished$), buffer(finished$))
      .subscribe((logs = []) => (this.consoleOutput = logs.join('<br>')));

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
}
