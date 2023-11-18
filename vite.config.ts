/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vite';
import packageJson from './package.json';
import dts from 'vite-plugin-dts';

const getPackageName = () => {
  return packageJson.name;
};

const fileName = {
  es: `${getPackageName()}.js`,
  umd: `${getPackageName()}.min.js`,
};

const formats = Object.keys(fileName) as Array<keyof typeof fileName>;

module.exports = defineConfig({
  base: './',
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'aria',
      formats,
      fileName: format => fileName[format],
    },
  },
  test: {
    environment: 'jsdom',
  },
  plugins: [dts({ rollupTypes: true })],
});
