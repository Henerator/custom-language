import { ExpressionType } from './enums/expression-type.enum';
import { ExpressionNode } from './expression-node';

export class LogNode extends ExpressionNode {
  public type = ExpressionType.Log;

  constructor(public value: ExpressionNode) {
    super();
  }
}
