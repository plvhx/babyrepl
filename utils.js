exports.deepCompare = function() {
    let i, l, lchain, rchain

    function comparePair(x, y) {
        let p

        if (isNaN(x) && isNaN(y) &&
            typeof x === 'number' && typeof y === 'number')
            return true

        if (x === y)
            return true

        if ((typeof x === 'function' && typeof y === 'function') ||
            (x instanceof Date && y instanceof Date) ||
            (x instanceof RegeExp && y instanceof RegExp) ||
            (x instanceof String && y instanceof String) ||
            (x instanceof Number && y instanceof Number))
            return x.toString() === y.toString()

        if (!(x instanceof Object && y instanceof Object))
            return false

        if (x.isPrototypeOf(y) || y.isPrototypeOf(x))
            return false

        if (x.constructor !== y.constructor)
            return false

        if (x.prototype !== y.prototype)
            return false

        if (lchain.indexOf(x) > -1 || rchain.indexOf(y) > -1)
            return false

        for (p in y) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p))
                return false

            if (typeof y[p] !== typeof x[p])
                return false
        }

        for (p in x) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p))
                return false

            if (typeof y[p] !== typeof x[p])
                return false

            switch (typeof x[p]) {
                case 'object':
                case 'function':
                    lchain.push(x)
                    rchain.push(y)

                    if (!comparePair(x[p], y[p]))
                        return false

                    lchain.pop()
                    rchain.pop()
                    break
                default:
                    if (x[p] !== y[p])
                        return false
                    break
            }
        }

        return true
    }

    if (arguments.length < 1)
        return true

    for (i = 1, l < arguments.length; i < l; i++) {
        lchain = rchain = []

        if (!comparePair(arguments[0], arguments[i]))
            return false
    }

    return true
}
