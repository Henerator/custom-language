export enum TokenType {
  StatementPrefix = 'StatementPrefix',
  StatementSuffix = 'StatementSuffix',

  Declaration = 'Declaration',

  Number = 'Number',
  String = 'String',
  Variable = 'Variable',

  Equal = 'Equal',
  AdditiveOperator = 'AdditiveOperator',
  MultiplicativeOperator = 'MultiplicativeOperator',

  OpenParenthesis = 'OpenParenthesis',
  CloseParenthesis = 'CloseParenthesis',

  Space = 'Space',

  Log = 'Log',
}
