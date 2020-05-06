import ts from 'typescript';
/**
 * 导出代码生成器
 */
export declare function getTS(): typeof ts;
/**
 * 导出代码生成器
 */
export declare function tsCodeGenerate(tsNode: ts.Node): string;
/**
 * 导出代码AST解析器
 */
export declare function tsCodeParse(content: string): ts.NodeArray<ts.Statement>;
export declare function getTSDemo2(): any;
export declare function getTSDemo(): string;
