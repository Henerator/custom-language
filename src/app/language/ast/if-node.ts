import { ConditionNode } from './condition-node';
import { ExpressionType } from './enums/expression-type.enum';
import { ExpressionNode } from './expression-node';

export class IfNode extends ExpressionNode {
  public type = ExpressionType.If;

  constructor(
    public condition: ConditionNode,
    public expression: ExpressionNode
  ) {
    super();
  }
}
