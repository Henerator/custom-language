import { TokenType } from './enums/token-type.enum';

export class Token {
  constructor(
    public type: TokenType,
    public value: string,
    public position: number,
    public line: number,
    public char: number
  ) {}
}
