const Ast = require('./ast')
const astType = require('./astType')
const tokenType = require('./tokenType')
const { deepCompare } = require('./utils')

function Parser(tokens) {
    this.tokens = tokens
    this.pos  = 0
    this.root = null
    this.node = null
    this.prec = {'*': 8, '/': 4, '+': 2, '-': 1}
}

Parser.prototype.parse = function() {
    while (!this.isEOF()) {
        switch (this.current().getType()) {
            case tokenType['number']:
                this.processNumber()
                break
            case tokenType['plus']:
                this.processAddition()
                break
            case tokenType['dash']:
                this.processSubtraction()
                break
            case tokenType['star']:
                this.processMultiplication()
                break
            case tokenType['slash']:
                this.processDivision()
                break
        }
    }
}

Parser.prototype.ast = function() {
    return this.root
}

Parser.prototype.current = function() {
    return this.tokens[this.getPos()]
}

Parser.prototype.getPos = function() {
    return this.pos
}

Parser.prototype.incPos = function() {
    this.pos++
}

Parser.prototype.decPos = function() {
    this.pos--
}

Parser.prototype.peek = function(depth) {
    return this.tokens[this.getPos() + depth]
}

Parser.prototype.backtrack = function(depth) {
    return this.tokens[this.getPos() - depth]
}

Parser.prototype.isEOF = function() {
    return this.getPos() >= this.tokens.length
}

Parser.prototype.processNumber = function() {
    if (this.node !== null &&
        (this.node.getType() === astType['add'] ||
         this.node.getType() === astType['sub'] ||
         this.node.getType() === astType['mul'] ||
         this.node.getType() === astType['div'])) {
        this.node.addChild(new Ast(this.current(), astType['number']))
        this.incPos()
        return
    }

    this.node = new Ast(this.current(), astType['number'])
    this.incPos()
}

Parser.prototype.checkPrecedingExpr = function() {
    if (this.node.getType() === astType['add'] ||
        this.node.getType() === astType['sub'] ||
        this.node.getType() === astType['mul'] ||
        this.node.getType() === astType['div'])
        return true

    return false
}

Parser.prototype.rebuildPrecedence = function(a, b) {
    let ap = this.prec[a.getValue()]
    let bp = this.prec[b.getValue()]
    let lo = ap < bp ? a : b
    let hi = lo.getValue() !== a.getValue() ? a : b

    if (a.getChilds().length != 2)
        throw new Error('Left-side operator must have exactly 2 childs.')

    if (b.getChilds().length != 0)
        throw new Error('Right side operator must have empty childs.')

    if (!lo.getChilds().length) {
        lo.addChild(hi)
        this.root = lo
        return lo
    }

    let x = lo.getChilds().pop()
    let y = lo.getChilds().pop()

    hi.addChild(x)
    lo.addChild(y)
    lo.addChild(hi)

    this.root = lo
    return hi
}

Parser.prototype.processAddition = function() {
    if (this.backtrack(1) === undefined ||
        this.backtrack(1).getType() !== tokenType['number'])
        throw new Error('Addition operator must be preceded by number.')


    if (this.root !== null) {
        this.node = this.rebuildPrecedence(this.node, new Ast(this.current(), astType['add']))
        this.incPos()
        return
    }

    let node = new Ast(this.current(), astType['add'])
    node.addChild(this.node)

    this.node = node
    this.root = this.root === null ? this.node : this.root
    this.incPos()
}

Parser.prototype.processSubtraction = function() {
    if (this.backtrack(1) === undefined ||
        this.backtrack(1).getType() !== tokenType['number'])
        throw new Error('Subtraction operator must be preceded by number.')

    if (this.root !== null) {
        this.node = this.rebuildPrecedence(this.node, new Ast(this.current(), astType['sub']))
        this.incPos()
        return
    }

    let node = new Ast(this.current(), astType['sub'])
    node.addChild(this.node)

    this.node = node
    this.root = this.root === null ? this.node : this.root
    this.incPos()
}

Parser.prototype.processMultiplication = function() {
    if (this.backtrack(1) === undefined ||
        this.backtrack(1).getType() !== tokenType['number'])
        throw new Error('Multiplication operator must be preceded by number.')

    if (this.root !== null) {
        this.node = this.rebuildPrecedence(this.node, new Ast(this.current(), astType['mul']))
        this.incPos()
        return
    }

    let node = new Ast(this.current(), astType['mul'])
    node.addChild(this.node)

    this.node = node
    this.root = this.root === null ? this.node : this.root
    this.incPos()
}

Parser.prototype.processDivision = function() {
    if (this.backtrack(1) === undefined ||
        this.backtrack(1).getType() !== tokenType['number'])
        throw new Error('Division operator must be preceded by number.')

    if (this.root !== null) {
        this.node = this.rebuildPrecedence(this.node, new Ast(this.current(), astType['div']))
        this.incPos()
        return
    }

    let node = new Ast(this.current(), astType['div'])
    node.addChild(this.node)

    this.node = node
    this.root = this.root === null ? this.node : this.root
    this.incPos()
}

module.exports = Parser
