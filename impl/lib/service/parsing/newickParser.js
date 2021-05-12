'use strict'

function parseNewick(newickData) {
    return parse(newickData)
}

const parse = s => {
    const ancestors = []
    let tree = {}
    const tokens = s.split(/\s*([;(),:])\s*/)
    let subtree

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]

        switch (token) {
            case '(': // new children
                subtree = {}
                tree.children = [subtree]
                ancestors.push(tree)
                tree = subtree
                break
            case ',': // another branch
                subtree = {}
                ancestors[ancestors.length - 1].children.push(subtree)
                tree = subtree
                break
            case ')': // optional name next
                tree = ancestors.pop()
                break
            case ':': // optional length next
                break
            default:
                const x = tokens[i - 1]

                if (x === ')' || x === '(' || x === ',') {
                    tree.name = token
                } else if (x === ':') {
                    tree.length = parseFloat(token)
                }
        }
    }

    return tree
}

module.exports = parseNewick