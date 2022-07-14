import { ExpressionType } from './enums/expression-type.enum';
import { ExpressionNode } from './expression-node';

export class NumberNode extends ExpressionNode {
  public type = ExpressionType.NumericLiteral;

  constructor(public value: string) {
    super();
  }
}
