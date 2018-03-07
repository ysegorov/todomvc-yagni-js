
// import pkg from './package.json';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [
  {
    input: 'src/app.js',
    output: [
      {file: 'dist/js/bundle.js', format: 'iife', name: 'todoApp'}
    ],
    plugins: [
      eslint({throwOnError: true}),
      resolve(),
      commonjs()
    ]
  }
];
