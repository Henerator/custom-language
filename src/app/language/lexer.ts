import { TokenType } from './enums/token-type.enum';
import { ErrorProducer } from './error-producer';
import { Token } from './token';

type MatchGetter = (match: RegExpMatchArray) => string;

const defaultMatchGetter: MatchGetter = (match) => match[0];
const firstGroupMatchGetter: MatchGetter = (match) => match[1];

interface LexerTokenMatch {
  match: string;
  value: string;
}

class LexerToken {
  constructor(
    public type: TokenType,
    public regex: string,
    public flags = '',
    private matchGetter = defaultMatchGetter
  ) {}

  getMatch(text: string): LexerTokenMatch | null {
    const regex = new RegExp(`^${this.regex}`, this.flags);
    const match = text.match(regex);

    if (match === null) return null;

    return {
      match: match[0],
      value: this.matchGetter(match),
    };
  }
}

const LexerDictionary = [
  new LexerToken(TokenType.Space, `[\t\r ]+`),
  new LexerToken(TokenType.NewLine, `\n+`),
  new LexerToken(TokenType.Comment, `\/\/.*`),

  new LexerToken(TokenType.StatementPrefix, `lena`, 'i'),
  new LexerToken(TokenType.StatementSuffix, `please`, 'i'),
  new LexerToken(TokenType.Log, `say`),

  new LexerToken(TokenType.If, `if you think`, 'i'),

  new LexerToken(TokenType.Declaration, `set`),

  new LexerToken(TokenType.Number, `[0-9]+`),
  new LexerToken(TokenType.String, `'([^']*)'`, '', firstGroupMatchGetter),
  new LexerToken(TokenType.Variable, `[a-z]+[a-z0-9_]*`, 'i'),

  new LexerToken(TokenType.Equal, `=`),
  new LexerToken(TokenType.Minus, `\\-`),
  new LexerToken(TokenType.Plus, `\\+`),
  new LexerToken(TokenType.Multiplier, `\\*`),
  new LexerToken(TokenType.Divider, `\\/`),
  new LexerToken(TokenType.ConditionalOperator, `(<=|>=|==|<|>)`),

  new LexerToken(TokenType.OpenParenthesis, `\\(`),
  new LexerToken(TokenType.CloseParenthesis, `\\)`),
];

const ingoreTokenTypes = new Set([
  TokenType.Space,
  TokenType.NewLine,
  TokenType.Comment,
]);

export class Lexer extends ErrorProducer {
  private code = '';
  private position = 0;
  private line = 1;
  private lineChar = 1;
  private tokenList: Token[] = [];

  tokenize(code: string): Token[] {
    this.code = code;
    while (this.nextToken()) {}
    return this.tokenList.filter((token) => !ingoreTokenTypes.has(token.type));
  }

  nextToken(): Token | null {
    if (this.position >= this.code.length) {
      return null;
    }

    const positionCode = this.code.substring(this.position);
    for (let i = 0; i < LexerDictionary.length; i++) {
      const lexerToken = LexerDictionary[i];
      const tokenMatch = lexerToken.getMatch(positionCode);

      if (tokenMatch) {
        const { match, value } = tokenMatch;
        const token = new Token(
          lexerToken.type,
          value,
          this.position,
          this.line,
          this.lineChar
        );
        this.position += match.length;
        this.lineChar += match.length;
        this.tokenList.push(token);
        this.handleToken(token, match);

        return token;
      }
    }

    this.throwError(
      `Unexpected token "${this.code[this.position]}" on line ${
        this.line
      } char ${this.lineChar}`
    );
  }

  private handleToken(token: Token, match: string): void {
    if (token.type === TokenType.NewLine) {
      this.line += match.length;
      this.lineChar = 1;
    }
  }
}
