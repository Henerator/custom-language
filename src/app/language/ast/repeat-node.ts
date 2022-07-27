import { BlockNode } from './block-node';
import { ExpressionType } from './enums/expression-type.enum';
import { ExpressionNode } from './expression-node';
import { NumberNode } from './number-node';

export class RepeatNode extends ExpressionNode {
  public type = ExpressionType.Repeat;

  constructor(public block: BlockNode, public count: NumberNode) {
    super();
  }
}
