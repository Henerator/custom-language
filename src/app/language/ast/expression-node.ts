import { ExpressionType } from './enums/expression-type.enum';

export abstract class ExpressionNode {
  public abstract type: ExpressionType;
}
