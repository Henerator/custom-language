import { Token } from '../token';
import { ExpressionType } from './enums/expression-type.enum';
import { ExpressionNode } from './expression-node';

export class AdditiveBinaryOperationNode extends ExpressionNode {
  public type = ExpressionType.AdditiveExpression;

  constructor(
    public operator: Token,
    public leftNode: ExpressionNode,
    public rightNode: ExpressionNode
  ) {
    super();
  }
}
