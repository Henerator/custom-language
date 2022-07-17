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
  Lena set c = 1 please
  Lena set condition = 'false' please
  Lena if you think c < 2 + 3 * 4 set condition = 'true' please
  Lena say condition please
`;
