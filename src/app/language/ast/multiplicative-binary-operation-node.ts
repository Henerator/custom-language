import { Token } from '../token';
import { ExpressionType } from './enums/expression-type.enum';
import { ExpressionNode } from './expression-node';

export class MultiplicativeBinaryOperationNode extends ExpressionNode {
  public type = ExpressionType.MultiplicativeExpression;

  constructor(
    public operator: Token,
    public leftNode: ExpressionNode,
    public rightNode: ExpressionNode
  ) {
    super();
  }
}
