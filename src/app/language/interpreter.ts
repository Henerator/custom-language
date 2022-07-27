import { Subject } from 'rxjs';
import {
  AdditiveBinaryOperationNode,
  BlockNode,
  ConditionNode,
  DeclarationNode,
  ExpressionNode,
  IfNode,
  LogNode,
  MultiplicativeBinaryOperationNode,
  NumberNode,
  RepeatNode,
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

  execute(block: BlockNode): void {
    this.reset();
    this.run(block);
  }

  private reset() {
    this.scope = {};
  }

  private run(node: ExpressionNode): any {
    if (node instanceof BlockNode) {
      node.expressions.forEach((expression, index) => {
        const output = this.run(expression);
        console.log(`[${index}]: ${output}`);
      });
      return;
    }

    if (node instanceof RepeatNode) {
      let count = this.run(node.count);
      while (count-- > 0) {
        this.run(node.block);
      }
      return;
    }

    if (node instanceof VariableNode) {
      if (!this.scope.hasOwnProperty(node.name)) {
        this.throwError(`Variable "${node.name}" is not exist`);
      }

      return this.scope[node.name];
    }

    if (node instanceof NumberNode) {
      return parseFloat(node.value);
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
      switch (node.operator.type) {
        case TokenType.LessEqual:
          return leftValue <= rightValue;
        case TokenType.MoreEqual:
          return leftValue >= rightValue;
        case TokenType.EqualEqual:
          return leftValue == rightValue;
        case TokenType.Less:
          return leftValue < rightValue;
        case TokenType.More:
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
