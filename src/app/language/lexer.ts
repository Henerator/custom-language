import { TokenType } from './enums/token-type.enum';
import { ErrorProducer } from './error-producer';
import { Token } from './token';

class LexerToken {
  constructor(
    public type: TokenType,
    public regex: string,
    public flags = ''
  ) {}
}

const LexerDictionary = [
  new LexerToken(TokenType.StatementPrefix, `lena`, 'i'),
  new LexerToken(TokenType.StatementSuffix, `please`, 'i'),
  new LexerToken(TokenType.Log, `say`),

  new LexerToken(TokenType.Declaration, `set`),

  new LexerToken(TokenType.Number, `[0-9]*`),
  new LexerToken(TokenType.String, `'[^']*'`),
  new LexerToken(TokenType.Variable, `[a-z]+[a-z0-9_]*`, 'i'),

  new LexerToken(TokenType.Equal, `=`),
  new LexerToken(TokenType.AdditiveOperator, `[+-]`),
  new LexerToken(TokenType.MultiplicativeOperator, `[*/]`),

  new LexerToken(TokenType.OpenParenthesis, `\\(`),
  new LexerToken(TokenType.CloseParenthesis, `\\)`),

  new LexerToken(TokenType.Space, `\\s+`),
];

const ingoreTokenTypes = new Set([TokenType.Space]);

export class Lexer extends ErrorProducer {
  private code = '';
  private position = 0;
  private tokenList: Token[] = [];

  tokenize(code: string): Token[] {
    this.code = code;
    while (this.nextToken()) {}
    this.tokenList = this.tokenList.filter(
      (token) => !ingoreTokenTypes.has(token.type)
    );
    return this.tokenList;
  }

  nextToken(): Token | null {
    if (this.position >= this.code.length) {
      return null;
    }

    for (let i = 0; i < LexerDictionary.length; i++) {
      const lexerToken = LexerDictionary[i];
      const regex = new RegExp(`^${lexerToken.regex}`, lexerToken.flags);
      const result = this.code.substring(this.position).match(regex);

      if (result && result[0]) {
        const token = new Token(lexerToken.type, result[0], this.position);
        this.position += result[0].length;
        this.tokenList.push(token);

        return token;
      }
    }

    this.throwError(
      `Unexpected token "${this.code[this.position]}" on ${this.position}`
    );
  }
}
