import typescript from 'rollup-plugin-typescript'
import babel from 'rollup-plugin-babel'
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
  input: './src/index.tsx',
  output: {
    name: 'router',
    file: 'dist/router.esm.js',
    format: 'esm'
  },
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json'
    }),
    babel({
      extensions: ['ts'],
      exclude: 'node_modules/**',
    }),
    peerDepsExternal()
  ]
}