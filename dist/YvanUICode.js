// eslint-disable-next-line import/no-extraneous-dependencies
import ts from 'typescript';
/**
 * 导出代码生成器
 */
export function getTS() {
    return ts;
}
/**
 * 导出代码生成器
 */
export function tsCodeGenerate(tsNode) {
    var resultFile = ts.createSourceFile("someFileName.ts", "", ts.ScriptTarget.ES2019, 
    /*setParentNodes*/ false, ts.ScriptKind.TS);
    var printer = ts.createPrinter({
        newLine: ts.NewLineKind.LineFeed
    });
    var result = printer.printNode(ts.EmitHint.Unspecified, tsNode, resultFile);
    return result;
}
/**
 * 导出代码AST解析器
 */
export function tsCodeParse(content) {
    var file = ts.createSourceFile("someFileName.ts", content, ts.ScriptTarget.ES2019, 
    /*setParentNodes*/ false, ts.ScriptKind.TS);
    return file.statements;
}
export function getTSDemo2() {
    var resultFile = ts.createSourceFile("someFileName.ts", contentText, ts.ScriptTarget.ES2019, 
    /*setParentNodes*/ false, ts.ScriptKind.TS);
    return resultFile;
}
export function getTSDemo() {
    function makeFactorialFunction() {
        var functionName = ts.createIdentifier("factorial");
        var paramName = ts.createIdentifier("n");
        var parameter = ts.createParameter(
        /*decorators*/ undefined, 
        /*modifiers*/ undefined, 
        /*dotDotDotToken*/ undefined, paramName);
        var condition = ts.createBinary(paramName, ts.SyntaxKind.LessThanEqualsToken, ts.createLiteral(1));
        var ifBody = ts.createBlock([ts.createReturn(ts.createLiteral(1))], 
        /*multiline*/ true);
        var decrementedArg = ts.createBinary(paramName, ts.SyntaxKind.MinusToken, ts.createLiteral(1));
        var recurse = ts.createBinary(paramName, ts.SyntaxKind.AsteriskToken, ts.createCall(functionName, /*typeArgs*/ undefined, [decrementedArg]));
        var statements = [
            ts.createEnumDeclaration(undefined, undefined, ts.createIdentifier("MyEnum"), [
                ts.createEnumMember(ts.createIdentifier("member"), undefined),
                ts.createEnumMember(ts.createIdentifier("user"), undefined)
            ]),
            ts.createIf(condition, ifBody), ts.createReturn(recurse)
        ];
        return ts.createFunctionDeclaration(
        /*decorators*/ undefined, 
        /*modifiers*/ [ts.createToken(ts.SyntaxKind.ExportKeyword)], 
        /*asteriskToken*/ undefined, functionName, 
        /*typeParameters*/ undefined, [parameter], 
        /*returnType*/ ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword), ts.createBlock(statements, /*multiline*/ true));
    }
    var resultFile = ts.createSourceFile("someFileName.ts", "", ts.ScriptTarget.ES2019, 
    /*setParentNodes*/ false, ts.ScriptKind.TS);
    var printer = ts.createPrinter({
        newLine: ts.NewLineKind.LineFeed
    });
    var result = printer.printNode(ts.EmitHint.Unspecified, makeFactorialFunction(), resultFile);
    return result;
}
var contentText = "export type Refs = {\n};\n\nexport default abstract class<M, INP> extends YvanUI.BaseDialog<M, Refs, INP> {\n\n    main: {\n        FADMINID:string,\n        FADMINNAME: string,\n        FADMINPHONE: string,\n        FEMAIL: string\n    } = {\n        FADMINID:'',\n        FADMINNAME: '',\n        FADMINPHONE:'',\n        FEMAIL:''\n    };\n\n    viewResolver(): any {\n        console.log(this, this.inParamter);\n\n        return {\n            title: '\u8054\u7CFB\u65B9\u5F0F\u7EF4\u62A4',\n            modal: true,\n            width: 400,\n            height: 200,\n            body: {\n                rows: [\n                    {\n                        view: 'text',\n                        entityName: \"main.FADMINNAME\",\n                        label: \"\u7BA1\u7406\u5458\u540D\u79F0\",\n                        required: true,\n                        width: 320,\n                    },\n                    {\n                        view: 'text',\n                        entityName: 'main.FADMINPHONE',\n                        label: '\u7BA1\u7406\u5458\u8054\u7CFB\u65B9\u5F0F',\n                        width: 320,\n                        required: true,\n                    },\n                    {\n                        view: 'text',\n                        entityName: \"main.FEMAIL\",\n                        label: \"\u8054\u7CFBEMAIL\",\n                        width: 320,\n                        required: true,\n                    },\n                    {\n                        cols: [\n                            {width: 110},\n                            {\n                                view: \"button\", text: \"\u786E\u5B9A\", cssType: \"primary\", width: 0,\n                                onClick: {\n                                    type: 'function',\n                                    bind: 'ok'\n                                }\n                            },\n                            {\n                                view: \"button\", text: \"\u53D6\u6D88\", cssType: 'default', width: 0,\n                                onClick: {\n                                    type: 'function',\n                                    bind: 'cancel'\n                                }\n                            }\n                        ]\n                    }\n                ]\n            }\n        }\n    }\n}";
//# sourceMappingURL=YvanUICode.js.map