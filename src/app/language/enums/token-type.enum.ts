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
  EqualEqual = 'EqualEqual',

  Less = 'Less',
  LessEqual = 'LessEqual',
  MoreEqual = 'MoreEqual',
  More = 'More',

  Minus = 'Minus',
  Plus = 'Plus',
  Multiplier = 'Multiplier',
  Divider = 'Divider',

  OpenParenthesis = 'OpenParenthesis',
  CloseParenthesis = 'CloseParenthesis',
}
