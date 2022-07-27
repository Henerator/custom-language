import { ExpressionType } from './enums/expression-type.enum';
import { ExpressionNode } from './expression-node';

export class BlockNode extends ExpressionNode {
  public type = ExpressionType.Block;

  constructor(public expressions: ExpressionNode[]) {
    super();
  }
}
