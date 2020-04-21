import { name } from '../package.json'
import { resolve } from 'path'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss';
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
// import cssnano from 'cssnano';

export default {
  // 入口文件
  input: resolve(__dirname, '../src/index.ts'),
  output: {
    // 打包名称
    name: name,
    exports: 'named',
    // 启用代码映射，便于调试之用
    sourcemap: true,
  },
  plugins: [
    postcss({
      extensions: ['.css'],
      extract: true,
      extract: 'yvan-ui.css',
      plugins: [
        simplevars(),
        nested(),
        cssnext({ warnForDuplicates: false, }),
        // cssnano()
      ]
    }),
    typescript({
      exclude: ['./dist', './src/**/*.test.ts'],
    }),
  ],
}
