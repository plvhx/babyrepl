const astType = require('./astType')

function Eval(ast) {
    this.ast = ast
}

Eval.prototype._processAddition = function(a, b) {
    return a + b
}

Eval.prototype._processSubtraction = function(a, b) {
    return a - b
}

Eval.prototype._processMultiplication = function(a, b) {
    return a * b
}

Eval.prototype._processDivision = function(a, b) {
    if (!b)
        throw new Error('Division by zero.')

    return a / b
}

Eval.prototype.isOperator = function(n) {
    if (n.getType() === astType['add'] ||
        n.getType() === astType['sub'] ||
        n.getType() === astType['mul'] ||
        n.getType() === astType['div'])
        return true

    return false
}

Eval.prototype._process = function(n) {
    switch (n.getType()) {
        case astType['add']:
            return this._processAddition(
                this.isOperator(n.getChildAt(0)) ? this._process(n.getChildAt(0)) : n.getChildAt(0).getValue(),
                this.isOperator(n.getChildAt(1)) ? this._process(n.getChildAt(1)) : n.getChildAt(1).getValue()
            )
        case astType['sub']:
            return this._processSubtraction(
                this.isOperator(n.getChildAt(0)) ? this._process(n.getChildAt(0)) : n.getChildAt(0).getValue(),
                this.isOperator(n.getChildAt(1)) ? this._process(n.getChildAt(1)) : n.getChildAt(1).getValue()
            )
        case astType['mul']:
            return this._processMultiplication(
                this.isOperator(n.getChildAt(0)) ? this._process(n.getChildAt(0)) : n.getChildAt(0).getValue(),
                this.isOperator(n.getChildAt(1)) ? this._process(n.getChildAt(1)) : n.getChildAt(1).getValue()
            )
        case astType['div']:
            return this._processDivision(
                this.isOperator(n.getChildAt(0)) ? this._process(n.getChildAt(0)) : n.getChildAt(0).getValue(),
                this.isOperator(n.getChildAt(1)) ? this._process(n.getChildAt(1)) : n.getChildAt(1).getValue()
            )
    }

    return false
}

Eval.prototype.eval = function() {
    return this._process(this.ast)
}

module.exports = Eval
