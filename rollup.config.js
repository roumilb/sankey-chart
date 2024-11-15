import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {terser} from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/bundle.js',
        format: 'iife',
        name: 'SankeyChart'
    },
    plugins: [
        typescript(),
        resolve(),
        commonjs(),
        terser(),
        postcss()
    ],
    watch: {
        include: 'src/**/*'
    }
};
