import { ExpressionType } from './enums/expression-type.enum';
import { ExpressionNode } from './expression-node';

export class VariableNode extends ExpressionNode {
  public type = ExpressionType.VariableLiteral;

  constructor(public name: string) {
    super();
  }
}
