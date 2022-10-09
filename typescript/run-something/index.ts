import remarkParse from 'remark-parse'
import {unified} from 'unified'
import {attacher} from "../../../remark-add-code-titles/src";

const tree = unified()
    .use(remarkParse)
    .use(attacher)
    .parse('' +
        '# Hello world!\n' +
        'Here is a paragraph')
//
// // console.log(tree)
// console.log(tree)
// console.log("")
// console.log("")

attacher()();
