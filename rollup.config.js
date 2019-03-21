import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
// import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import ignore from 'rollup-plugin-ignore';

export default {
  // input: 'src/components/qinputex/index.ts',
  input: 'dist/esm/components/qinputex/index.js',
  output: [
    {
      file: 'dist/umd/qinputex.js',
      format: 'umd',
      name: 'qinputex',
      sourcemap: true,
    },
  ],
  plugins: [
    ignore(['quasar', 'vue']),
    resolve(),
    // typescript(),
    json(),
    commonjs(),
  ]
};

