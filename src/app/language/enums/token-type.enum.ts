export enum TokenType {
  StatementPrefix = 'StatementPrefix',
  StatementSuffix = 'StatementSuffix',
  Log = 'Log',

  If = 'If',

  Space = 'Space',
  NewLine = 'NewLine',
  Comment = 'Comment',

  Declaration = 'Declaration',

  Number = 'Number',
  String = 'String',
  Variable = 'Variable',

  Equal = 'Equal',
  Minus = 'Minus',
  Plus= 'Plus',
  Multiplier = 'Multiplier',
  Divider= 'Divider',
  ConditionalOperator = 'ConditionalOperator',

  OpenParenthesis = 'OpenParenthesis',
  CloseParenthesis = 'CloseParenthesis',
}
