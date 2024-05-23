function Ast(value, type) {
    this.value = value === null ? value : value.getValue()
    this.type = type
    this.childs = []
}

Ast.prototype.getValue = function() {
    return this.value
}

Ast.prototype.getType = function() {
    return this.type
}

Ast.prototype.getChilds = function() {
    return this.childs
}

Ast.prototype.getChildAt = function(i) {
    return this.childs[i]
}

Ast.prototype.addChild = function(ast) {
    this.childs.push(ast)
}

module.exports = Ast
