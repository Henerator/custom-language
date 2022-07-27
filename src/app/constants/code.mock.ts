export const SourceCodeMock = `
  // you can define a variable
  Lena set a = 2 please
  Lena set b = 3 please

  // you can ask to output to the console
  Lena say a please
  Lena say a + b please

  // you can use math operations
  Lena say 20 / a + 2 * b - 1 please
  Lena say (1 + 2 * (3 + 4)) * 5 + 3 * 4 please

  // you can define strings
  Lena set text = 'text' please
  Lena say text please

  // you can use conditions
  Lena if you think 1 < 2 + 3 * 4 say 'true' please

  // you can use negative unary operator
  Lena set d = -1 please
  Lena say -(-d + 2) please

  // you can use float numbers
  Lena set f = 1.25 please
  Lena say f + 0.35 please

  // you can use loops
  Lena set iteration = 1 please
  Lena repeat [
    Lena say 'iteration ' + iteration please
    Lena set iteration = iteration + 1 please
  ] 5 times please
`;
