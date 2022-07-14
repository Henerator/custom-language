import { Subject } from 'rxjs';
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

export class Interpreter {
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
        throw new Error(`Variable "${node.name}" is not exist`);
      }

      return this.scope[node.name];
    }

    if (node instanceof NumberNode) {
      return parseInt(node.value);
    }

    if (node instanceof StringNode) {
      return node.value;
    }

    if (node instanceof AdditiveBinaryOperationNode) {
      switch (node.operator.value) {
        case '+':
          return this.run(node.leftNode) + this.run(node.rightNode);
        case '-':
          return this.run(node.leftNode) - this.run(node.rightNode);
        default:
          throw new Error(`Unknown additive operator`);
      }
    }

    if (node instanceof MultiplicativeBinaryOperationNode) {
      switch (node.operator.value) {
        case '*':
          return this.run(node.leftNode) * this.run(node.rightNode);
        case '/':
          return this.run(node.leftNode) / this.run(node.rightNode);
        default:
          throw new Error(`Unknown multiplicative operator`);
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

    throw new Error(`Unknown expression type: ${node.type}`);
  }
}
