const Token = require('./token')
const tokenType = require('./tokenType')

function Lexer(buf) {
    this.buf = buf
    this.pos = 0
    this.tokens = []
}

Lexer.prototype.lex = function() {
    while (!this.isEOF()) {
        this.lexOnce()
        this.incPos()
    }
}

Lexer.prototype.lexOnce = function() {
    switch (this.current()) {
        case '+':
            this.processPlus()
            break
        case '-':
            this.processDash()
            break
        case '*':
            this.processStar()
            break
        case '/':
            this.processSlash()
            break
        default:
            if (this.isDigit(null))
                this.processDigit()
            break
    }
}

Lexer.prototype.getPos = function() {
    return this.pos
}

Lexer.prototype.incPos = function() {
    this.pos++
}

Lexer.prototype.decPos = function() {
    this.pos--
}

Lexer.prototype.isEOF = function() {
    return this.pos >= this.buf.length
}

Lexer.prototype.current = function() {
    return this.buf[this.getPos()]
}

Lexer.prototype.peek = function(depth) {
    return this.buf[this.getPos() + depth]
}

Lexer.prototype.backtrack = function(depth) {
    return this.buf[this.getPos() - depth]
}

Lexer.prototype.getTokens = function() {
    return this.tokens
}

Lexer.prototype.addToken = function(token) {
    this.tokens.push(token)
}

Lexer.prototype.isDigit = function(buf) {
    let inp = buf === null
        ? this.current()
        : (buf === undefined ? '' : buf)

    return /^\d+$/.test(inp)
}

Lexer.prototype.processPlus = function() {
    this.addToken(new Token(this.current(), tokenType['plus']))
    this.incPos()
}

Lexer.prototype.processDash = function() {
    this.addToken(new Token(this.current(), tokenType['dash']))
    this.incPos()
}

Lexer.prototype.processStar = function() {
    this.addToken(new Token(this.current(), tokenType['star']))
    this.incPos()
}

Lexer.prototype.processSlash = function() {
    this.addToken(new Token(this.current(), tokenType['slash']))
    this.incPos()
}

Lexer.prototype.processDigit = function() {
    buf  = this.current()
    next = this.peek(1)

    if (next === undefined || !this.isDigit(next)) {
        this.addToken(new Token(parseInt(buf), tokenType['number']))
        this.incPos()
        return
    }

    this.incPos()

    if (this.current() === undefined)
        return

    while (this.isDigit(null)) {
        buf += this.current()
        this.incPos()
    }

    this.addToken(new Token(parseInt(buf), tokenType['number']))
}

module.exports = Lexer
