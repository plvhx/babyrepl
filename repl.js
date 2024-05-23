const Eval = require('./eval')
const Lexer = require('./lexer')
const Parser = require('./parser')

const lexer = new Lexer('20 / 9 + 5 * 8')
lexer.lex()

const parser = new Parser(lexer.getTokens())
parser.parse()

const eval = new Eval(parser.ast())
console.log(eval.eval())
