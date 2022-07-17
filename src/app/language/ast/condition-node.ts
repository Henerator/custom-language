import { Token } from '../token';
import { ExpressionType } from './enums/expression-type.enum';
import { ExpressionNode } from './expression-node';

export class ConditionNode extends ExpressionNode {
  public type = ExpressionType.Condition;

  constructor(
    public operator: Token,
    public leftNode: ExpressionNode,
    public rightNode: ExpressionNode,
  ) {
    super();
  }
}
