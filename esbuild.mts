import { build } from 'esbuild'
import packageJSON from './package.json' with { type: "json" }
import { dtsPlugin } from 'esbuild-plugin-d.ts';

build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.min.js',
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'es2020',
  external: [...Object.keys(packageJSON.dependencies || {}), '*.d.ts'],
  plugins: [dtsPlugin({
    outDir: 'dist/types',
  })]
}).catch(() => process.exit(1))