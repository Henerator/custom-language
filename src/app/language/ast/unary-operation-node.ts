import { Token } from '../token';
import { ExpressionType } from './enums/expression-type.enum';
import { ExpressionNode } from './expression-node';

export class UnaryOperationNode extends ExpressionNode {
  public type = ExpressionType.UnaryExpression;

  constructor(public operator: Token, public value: ExpressionNode) {
    super();
  }
}
