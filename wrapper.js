const Eval = require('./eval')
const Lexer = require('./lexer')
const Parser = require('./parser')

function eval(expr) {
    let l = new Lexer(expr)
    l.lex()

    let p = new Parser(l.getTokens())
    p.parse()

    let e = new Eval(p.ast())
    return e.eval()
}

module.exports = eval
