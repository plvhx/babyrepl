const eval = require('./wrapper')
const psync = require('prompt-sync')()

function repl() {
    while (true) {
        try {
            let buf = psync('>> ')

            if (buf === '.q' ||
                buf === '.quit')
                return

            console.log(eval(buf))
        } catch (e) {
            console.log(e.message)
        }
    }
}

module.exports = repl
