const fs = require('fs')

let jestSetup = fs.readFileSync('./jest/setup.ts', 'utf8')
const matches = jestSetup.matchAll(/.+require\(.+\)/g)
const idx = [...matches][1].index

jestSetup = [jestSetup.slice(0, idx), 'hello world\n', jestSetup.slice(idx)].join('')


function insertStringAtRegexPosition (regex, string, position = 0) {
    const matches = jestSetup.matchAll(regex)
    const idx = [...matches][position].index
    return [jestSetup.slice(0, idx), string + '\n', jestSetup.slice(idx)].join('')
}
