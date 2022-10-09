import {unified} from 'unified'
import remarkParse from 'remark-parse'

console.log(tree)


import attacher from "./plugin.ts";


const tree = unified()
    .use(remarkParse)
    .use(attacher)
    .parse('' +
        '# Hello world!\n' +
        'Here is a paragraph')

// console.log(tree)
console.log("")
console.log("")
console.log("")
