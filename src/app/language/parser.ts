import {
  AdditiveBinaryOperationNode,
  DeclarationNode,
  ExpressionNode,
  LogNode,
  MultiplicativeBinaryOperationNode,
  NumberNode,
  StringNode,
  VariableNode,
} from './ast';
import { TokenType } from './enums/token-type.enum';
import { ErrorProducer } from './error-producer';
import { Token } from './token';

export class Parser extends ErrorProducer {
  private lookahead: Token | null = null;
  private tokens: Token[] = [];
  private position = -1;

  /**
   * parse array of tokens
   * @param tokens array of tokens
   */
  parse(tokens: Token[]) {
    this.tokens = tokens;
    this.position = -1;
    this.lookahead = this.getNextToken();

    const statements = [];
    while (this.lookahead) {
      statements.push(this.parseExpressionStatement());
    }

    return statements;
  }

  private getNextToken(): Token {
    const nextToken = this.tokens[++this.position] || null;
    return nextToken;
  }

  private parseExpressionStatement() {
    this.consume(TokenType.StatementPrefix);
    const expression = this.parseExpression();
    this.consume(TokenType.StatementSuffix);
    return expression;
  }

  private parseExpression(): ExpressionNode {
    switch (this.lookahead?.type) {
      case TokenType.Declaration:
        return this.parseDelcaration();
      case TokenType.Log:
        return this.parseLog();
      default:
        return this.parseAdditiveExpression();
    }
  }

  private parseLog(): ExpressionNode {
    this.consume(TokenType.Log);
    const expression = this.parseExpression();
    return new LogNode(expression);
  }

  private parseDelcaration(): ExpressionNode {
    this.consume(TokenType.Declaration);
    const variableToken = this.consume(TokenType.Variable);
    this.consume(TokenType.Equal);
    const valueToken = this.parseExpression();

    return new DeclarationNode(variableToken.value, valueToken);
  }

  private parseAdditiveExpression(): ExpressionNode {
    let leftNode = this.parseMultiplicativeExpression();

    while (this.lookahead?.type === TokenType.AdditiveOperator) {
      const operator = this.consume(TokenType.AdditiveOperator);
      const rightNode = this.parseMultiplicativeExpression();

      leftNode = new AdditiveBinaryOperationNode(operator, leftNode, rightNode);
    }

    return leftNode;
  }

  private parseMultiplicativeExpression(): ExpressionNode {
    let leftNode = this.parsePrimaryExpression();

    while (this.lookahead?.type === TokenType.MultiplicativeOperator) {
      const operator = this.consume(TokenType.MultiplicativeOperator);
      const rightNode = this.parsePrimaryExpression();

      leftNode = new MultiplicativeBinaryOperationNode(
        operator,
        leftNode,
        rightNode
      );
    }

    return leftNode;
  }

  private parsePrimaryExpression(): ExpressionNode {
    switch (this.lookahead?.type) {
      case TokenType.OpenParenthesis:
        return this.parseParenthesizedExpression();
      default:
        return this.parseLiteral();
    }
  }

  private parseParenthesizedExpression(): ExpressionNode {
    this.consume(TokenType.OpenParenthesis);
    const expression = this.parseExpression();
    this.consume(TokenType.CloseParenthesis);
    return expression;
  }

  private parseLiteral(): ExpressionNode {
    const token = this.lookahead;
    switch (token?.type) {
      case TokenType.Variable:
        return this.parseVariableLiteral();
      case TokenType.Number:
        return this.parseNumericLiteral();
      case TokenType.String:
        return this.parseStringLiteral();
    }

    this.throwError(`Unexpected literal on ${token?.position}`);
  }

  private parseNumericLiteral(): ExpressionNode {
    const token = this.consume(TokenType.Number);
    return new NumberNode(token.value);
  }

  private parseStringLiteral(): ExpressionNode {
    const token = this.consume(TokenType.String);
    return new StringNode(token.value);
  }

  private parseVariableLiteral(): ExpressionNode {
    const token = this.consume(TokenType.Variable);
    return new VariableNode(token.value);
  }

  /**
   * expects a token of a given type
   * @param type type of expected token
   */
  private consume(type: TokenType): Token {
    const token = this.lookahead;

    if (token === null) {
      this.throwError(`Unexpected end of input, expected: "${type}"`);
    }

    if (token.type !== type) {
      this.throwError(
        `Unexpected token: "${token.type}", expected: "${type}" on ${token.position}`
      );
    }

    this.lookahead = this.getNextToken();
    return token;
  }
}
