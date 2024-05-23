function Token(value, type) {
    this.value = value
    this.type = type
}

Token.prototype.getValue = function() {
    return this.value
}

Token.prototype.setValue = function(value) {
    this.value = value
}

Token.prototype.getType = function() {
    return this.type
}

Token.prototype.setType = function(type) {
    this.type = type
}

module.exports = Token
