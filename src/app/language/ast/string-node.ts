import { ExpressionType } from './enums/expression-type.enum';
import { ExpressionNode } from './expression-node';

export class StringNode extends ExpressionNode {
  public type = ExpressionType.StringLiteral;

  constructor(public value: string) {
    super();
  }
}
