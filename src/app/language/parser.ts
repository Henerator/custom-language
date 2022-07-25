import {
  AdditiveBinaryOperationNode,
  ConditionNode,
  DeclarationNode,
  ExpressionNode,
  IfNode,
  LogNode,
  MultiplicativeBinaryOperationNode,
  NumberNode,
  StringNode,
  UnaryOperationNode,
  VariableNode,
} from './ast';
import { AdditiveTokens } from './constants/additive-tokens.const';
import { ComparisonTokens } from './constants/comparison-tokens.const';
import { MultiplicativeTokens } from './constants/multiplicative-tokens.const';
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
      statements.push(this.parseStatement());
    }

    return statements;
  }

  private getNextToken(): Token {
    const nextToken = this.tokens[++this.position] || null;
    return nextToken;
  }

  private parseStatement() {
    this.consume(TokenType.StatementPrefix);
    const expression = this.parseExpression();
    this.consume(TokenType.StatementSuffix);
    return expression;
  }

  private parseExpression(): ExpressionNode {
    switch (this.lookahead?.type) {
      case TokenType.If:
        return this.parseIf();
      case TokenType.Declaration:
        return this.parseDeclaration();
      case TokenType.Log:
        return this.parseLog();
      default:
        return this.parseAdditiveExpression();
    }
  }

  private parseIf(): ExpressionNode {
    this.consume(TokenType.If);
    const condition = this.parseCondition();
    const expression = this.parseExpression();
    return new IfNode(condition, expression);
  }

  private parseCondition(): ConditionNode {
    const leftNode = this.parseExpression();
    const operator = this.consumeComparisonToken();
    const rightNode = this.parseExpression();

    return new ConditionNode(operator, leftNode, rightNode);
  }

  private parseLog(): ExpressionNode {
    this.consume(TokenType.Log);
    const expression = this.parseExpression();
    return new LogNode(expression);
  }

  private parseDeclaration(): ExpressionNode {
    this.consume(TokenType.Declaration);
    const variableToken = this.consume(TokenType.Variable);
    this.consume(TokenType.Equal);
    const valueToken = this.parseExpression();

    return new DeclarationNode(variableToken.value, valueToken);
  }

  private parseAdditiveExpression(): ExpressionNode {
    let leftNode = this.parseMultiplicativeExpression();

    while (this.lookahead && AdditiveTokens.includes(this.lookahead.type)) {
      const operator = this.consumeAdditiveToken();
      const rightNode = this.parseMultiplicativeExpression();

      leftNode = new AdditiveBinaryOperationNode(operator, leftNode, rightNode);
    }

    return leftNode;
  }

  private parseMultiplicativeExpression(): ExpressionNode {
    let leftNode = this.parsePrimaryExpression();

    while (
      this.lookahead &&
      MultiplicativeTokens.includes(this.lookahead.type)
    ) {
      const operator = this.consumeMultiplicativeToken();
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
      case TokenType.Minus:
        return this.parseUnaryExpression(TokenType.Minus);
      case TokenType.Plus:
        return this.parseUnaryExpression(TokenType.Plus);
      case TokenType.OpenParenthesis:
        return this.parseParenthesizedExpression();
      default:
        return this.parseLiteral();
    }
  }

  private parseUnaryExpression(token: TokenType): ExpressionNode {
    const operator = this.consume(token);
    const expression = this.parsePrimaryExpression();
    return new UnaryOperationNode(operator, expression);
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

    this.throwError('Unexpected literal', token);
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
        `Unexpected token: "${token.type}", expected: "${type}"`,
        token
      );
    }

    this.lookahead = this.getNextToken();
    return token;
  }

  private consumeAdditiveToken(): Token {
    if (this.lookahead && AdditiveTokens.includes(this.lookahead.type)) {
      return this.consume(this.lookahead.type);
    }

    this.throwError(`Unknown additive operator "${this.lookahead?.type}"`);
  }

  private consumeMultiplicativeToken(): Token {
    if (this.lookahead && MultiplicativeTokens.includes(this.lookahead.type)) {
      return this.consume(this.lookahead.type);
    }

    this.throwError(
      `Unknown multiplicative operator "${this.lookahead?.type}"`
    );
  }

  private consumeComparisonToken(): Token {
    if (this.lookahead && ComparisonTokens.includes(this.lookahead.type)) {
      return this.consume(this.lookahead?.type);
    }

    this.throwError(`Unknown comparison operator "${this.lookahead?.type}"`);
  }
}
