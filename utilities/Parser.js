const babelParser = require("@babel/parser");
const traverse = require('babel-traverse').default;
const t = require('babel-types');
const babelGenerate = require('babel-generator').default;

const parse = function (source) {
    const ast = babelParser.parse(source, { sourceType: 'module', plugins: ['jsx'] });
    return ast;
}

const generate = function (ast, source) {
    const { code } = babelGenerate(ast, { /* Options */ }, source);
    return code;
}

const addCode = function (ast, code, options) {
    
   
    traverse(ast, {
        enter(path) {
        },
        
        ImportDeclaration(path) {
        },
        
        CallExpression(path) {
            console.log(path)
        }
    });
}

const addImport = function (ast, name, source) {
    const isImportDeclaration = path => (
        t.isImportDeclaration(path.node) ||
        t.isImportSpecifier(path.parent) ||
        t.isImportDeclaration(path.parent) ||
        t.isImportSpecifier(path.parent) ||
        t.isImportDefaultSpecifier(path.parent)
    );

    // Remember the last ImportDeclaration node
    let lastImport = null;
    let lastProperty = null;

    // Create a new import declaration. You can also create a factory function for that.
    const declaration = t.importDeclaration(
        [t.importDefaultSpecifier(t.identifier(`${name}`))], // This is the imported name
        t.stringLiteral(source), // This is the path to the source
    );

    traverse(ast, {
        enter(path) {
            if (lastImport && !isImportDeclaration(path)) {
                lastImport.insertAfter(declaration);
                lastImport = null;
            }
        },

        ImportDeclaration(path) {
            lastImport = path;
        },
    });
}

module.exports = {
    parse,
    generate,
    addImport,
    addCode
}