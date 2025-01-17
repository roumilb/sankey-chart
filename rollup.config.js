import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {terser} from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

const banner = `
/*!
 * SankeyChart - Lightweight javascript library to create sankey charts
 * https://github.com/roumilb/sankey-chart
 * Author: https://github.com/roumilb
 * Date: ${new Date().toISOString().split('T')[0]}
 * License: MIT
 */
`;

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/bundle.js',
        format: 'iife',
        name: 'SankeyChart',
        banner
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
