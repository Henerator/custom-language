import { Subject } from 'rxjs';
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
import { TokenType } from './enums/token-type.enum';
import { ErrorProducer } from './error-producer';

export class Interpreter extends ErrorProducer {
  private logEventSubject = new Subject<string>();
  private scope: any = {};

  logEvent$ = this.logEventSubject.asObservable();

  execute(expressions: ExpressionNode[]): void {
    this.reset();
    expressions.forEach((expression, index) => {
      const output = this.run(expression);
      console.log(`[${index}]: ${output}`);
    });
  }

  private reset() {
    this.scope = {};
  }

  private run(node: ExpressionNode): any {
    if (node instanceof VariableNode) {
      if (!this.scope.hasOwnProperty(node.name)) {
        this.throwError(`Variable "${node.name}" is not exist`);
      }

      return this.scope[node.name];
    }

    if (node instanceof NumberNode) {
      return parseInt(node.value);
    }

    if (node instanceof StringNode) {
      return node.value;
    }

    if (node instanceof UnaryOperationNode) {
      const value = this.run(node.value);
      if (!this.isNumber(value)) {
        this.throwError(
          `Unary operator "${node.operator.value}" can only be applied to numeric literals`,
          node.operator
        );
      }

      switch (node.operator.type) {
        case TokenType.Minus:
          return -value;
        case TokenType.Plus:
          return +value;
        default:
          this.throwError(`Unknown additive operator "${node.operator.value}"`);
      }
    }

    if (node instanceof AdditiveBinaryOperationNode) {
      switch (node.operator.type) {
        case TokenType.Minus:
          return this.run(node.leftNode) - this.run(node.rightNode);
        case TokenType.Plus:
          return this.run(node.leftNode) + this.run(node.rightNode);
        default:
          this.throwError(`Unknown additive operator "${node.operator.value}"`);
      }
    }

    if (node instanceof MultiplicativeBinaryOperationNode) {
      switch (node.operator.type) {
        case TokenType.Multiplier:
          return this.run(node.leftNode) * this.run(node.rightNode);
        case TokenType.Divider:
          return this.run(node.leftNode) / this.run(node.rightNode);
        default:
          this.throwError(
            `Unknown multiplicative operator "${node.operator.value}"`
          );
      }
    }

    if (node instanceof DeclarationNode) {
      const value = this.run(node.value);
      this.scope[node.name] = value;
      return value;
    }

    if (node instanceof LogNode) {
      const value = this.run(node.value);
      console.log(value);
      this.logEventSubject.next(value);
      return value;
    }

    if (node instanceof ConditionNode) {
      const leftValue = this.run(node.leftNode);
      const rightValue = this.run(node.rightNode);
      switch (node.operator.value) {
        case '<=':
          return leftValue <= rightValue;
        case '>=':
          return leftValue >= rightValue;
        case '==':
          return leftValue == rightValue;
        case '<':
          return leftValue < rightValue;
        case '>':
          return leftValue > rightValue;
        default:
          this.throwError(`Unknown condition operator: ${node.operator.value}`);
      }
    }

    if (node instanceof IfNode) {
      const conditionValue = this.run(node.condition);
      if (conditionValue) this.run(node.expression);
      return conditionValue;
    }

    this.throwError(`Unknown expression type: ${node.type}`);
  }

  private isNumber(value: unknown): boolean {
    return typeof value === 'number';
  }
}
