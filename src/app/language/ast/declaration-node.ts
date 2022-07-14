import { ExpressionType } from './enums/expression-type.enum';
import { ExpressionNode } from './expression-node';

export class DeclarationNode extends ExpressionNode {
  public type = ExpressionType.Declaration;

  constructor(public name: string, public value: ExpressionNode) {
    super();
  }
}
