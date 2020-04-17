// eslint-disable-next-line import/no-extraneous-dependencies
import ts from 'typescript'

/**
 * 导出代码生成器
 */
export function getTS(): typeof ts {
    return ts;
}

/**
 * 导出代码生成器
 */
export function tsCodeGenerate(tsNode: ts.Node): string {
    const resultFile = ts.createSourceFile(
        "someFileName.ts",
        "",
        ts.ScriptTarget.ES2019,
        /*setParentNodes*/ false,
        ts.ScriptKind.TS
    );
    const printer = ts.createPrinter({
        newLine: ts.NewLineKind.LineFeed
    });
    const result = printer.printNode(
        ts.EmitHint.Unspecified,
        tsNode,
        resultFile
    );

    return result;
}

/**
 * 导出代码AST解析器
 */
export function tsCodeParse(content: string): ts.NodeArray<ts.Statement> {
    const file = ts.createSourceFile(
        "someFileName.ts",
        content,
        ts.ScriptTarget.ES2019,
        /*setParentNodes*/ false,
        ts.ScriptKind.TS
    );
    return file.statements;
}

export function getTSDemo2(): any {
    const resultFile = ts.createSourceFile(
        "someFileName.ts",
        contentText,
        ts.ScriptTarget.ES2019,
        /*setParentNodes*/ false,
        ts.ScriptKind.TS
    );

    return resultFile;
}

export function getTSDemo(): string {

    function makeFactorialFunction() {

        const functionName = ts.createIdentifier("factorial");
        const paramName = ts.createIdentifier("n");
        const parameter = ts.createParameter(
            /*decorators*/ undefined,
            /*modifiers*/ undefined,
            /*dotDotDotToken*/ undefined,
            paramName
        );

        const condition = ts.createBinary(
            paramName,
            ts.SyntaxKind.LessThanEqualsToken,
            ts.createLiteral(1)
        );

        const ifBody = ts.createBlock(
            [ts.createReturn(ts.createLiteral(1))],
            /*multiline*/ true
        );
        const decrementedArg = ts.createBinary(
            paramName,
            ts.SyntaxKind.MinusToken,
            ts.createLiteral(1)
        );
        const recurse = ts.createBinary(
            paramName,
            ts.SyntaxKind.AsteriskToken,
            ts.createCall(functionName, /*typeArgs*/ undefined, [decrementedArg])
        );
        const statements = [
            ts.createEnumDeclaration(
                undefined,
                undefined,
                ts.createIdentifier("MyEnum"),
                [
                    ts.createEnumMember(
                        ts.createIdentifier("member"),
                        undefined
                    ),
                    ts.createEnumMember(
                        ts.createIdentifier("user"),
                        undefined
                    )
                ]
            ),
            ts.createIf(condition, ifBody), ts.createReturn(recurse)
        ];

        return ts.createFunctionDeclaration(
            /*decorators*/ undefined,
            /*modifiers*/ [ts.createToken(ts.SyntaxKind.ExportKeyword)],
            /*asteriskToken*/ undefined,
            functionName,
            /*typeParameters*/ undefined,
            [parameter],
            /*returnType*/ ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
            ts.createBlock(statements, /*multiline*/ true)
        );
    }

    const resultFile = ts.createSourceFile(
        "someFileName.ts",
        "",
        ts.ScriptTarget.ES2019,
        /*setParentNodes*/ false,
        ts.ScriptKind.TS
    );
    const printer = ts.createPrinter({
        newLine: ts.NewLineKind.LineFeed
    });
    const result = printer.printNode(
        ts.EmitHint.Unspecified,
        makeFactorialFunction(),
        resultFile
    );

    return result;
}

const contentText = `export type Refs = {
};

export default abstract class<M, INP> extends YvanUI.BaseDialog<M, Refs, INP> {

    main: {
        FADMINID:string,
        FADMINNAME: string,
        FADMINPHONE: string,
        FEMAIL: string
    } = {
        FADMINID:'',
        FADMINNAME: '',
        FADMINPHONE:'',
        FEMAIL:''
    };

    viewResolver(): any {
        console.log(this, this.inParamter);

        return {
            title: '联系方式维护',
            modal: true,
            width: 400,
            height: 200,
            body: {
                rows: [
                    {
                        view: 'text',
                        entityName: "main.FADMINNAME",
                        label: "管理员名称",
                        required: true,
                        width: 320,
                    },
                    {
                        view: 'text',
                        entityName: 'main.FADMINPHONE',
                        label: '管理员联系方式',
                        width: 320,
                        required: true,
                    },
                    {
                        view: 'text',
                        entityName: "main.FEMAIL",
                        label: "联系EMAIL",
                        width: 320,
                        required: true,
                    },
                    {
                        cols: [
                            {width: 110},
                            {
                                view: "button", text: "确定", cssType: "primary", width: 0,
                                onClick: {
                                    type: 'function',
                                    bind: 'ok'
                                }
                            },
                            {
                                view: "button", text: "取消", cssType: 'default', width: 0,
                                onClick: {
                                    type: 'function',
                                    bind: 'cancel'
                                }
                            }
                        ]
                    }
                ]
            }
        }
    }
}`;
