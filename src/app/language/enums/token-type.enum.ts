export enum TokenType {
  StatementPrefix = 'StatementPrefix',
  StatementSuffix = 'StatementSuffix',
  Log = 'Log',

  If = 'If',

  Space = 'Space',
  Comment = 'Comment',

  Declaration = 'Declaration',

  Number = 'Number',
  String = 'String',
  Variable = 'Variable',

  Equal = 'Equal',
  AdditiveOperator = 'AdditiveOperator',
  MultiplicativeOperator = 'MultiplicativeOperator',
  ConditionalOperator = 'ConditionalOperator',

  OpenParenthesis = 'OpenParenthesis',
  CloseParenthesis = 'CloseParenthesis',
}
