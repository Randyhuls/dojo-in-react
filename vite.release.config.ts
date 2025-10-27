// Vite plugins
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts'

// Dependencies
import path from 'path';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';

// Utils
import { createPackageJSON } from './compiler/build.utils';

const BUILD_PATH = './artifacts';
const BUNDLE_NAME = 'bundle';
const VERSION_NUMBER = '0.1.8'; // [!] Increment before publish new build
const IS_PRIVATE_PACKAGE = false; // [!] Set to false to allow public access on the NPM registry

const srcPackageJSON: Record<string, unknown> = JSON.parse(readFileSync('./package.json', 'utf-8').toString());
const outputDir = path.resolve(__dirname, BUILD_PATH);

export default defineConfig({
  plugins: [
    {
      name: 'clean-artifacts',
      configResolved: () => {
        if (existsSync(BUILD_PATH)) rmSync(outputDir, { recursive: true, force: true });
        mkdirSync(outputDir, { recursive: true });
      }
    },
    {
      name: 'create-package-json',
      buildEnd(error) {
        if (!error) this.info('Built package.json file for bundle');
      },
      writeBundle() {
        createPackageJSON({
          name: 'dojo-in-react',
          version: VERSION_NUMBER,
          private: IS_PRIVATE_PACKAGE,
          outputPath: `${outputDir}/package.json`,
          exports: {
            '.': {
              'import': `./${BUNDLE_NAME}.es.js`,
              'require': `./${BUNDLE_NAME}.cjs.js`
            }
          },
          types: `./${BUNDLE_NAME}.es.d.ts`,
          peerDependencies: srcPackageJSON['dependencies'] as Record<string, string>,
          author: srcPackageJSON['author'] as string,
          license: srcPackageJSON['license'] as string,
          keywords: srcPackageJSON['keywords'] as string[],
          repository: srcPackageJSON['repository'] as Record<string, string>
        })
      }     
    },
    viteStaticCopy({
      targets: [
        { src: './README.md', dest: outputDir },
      ],
    }),
    dts({ 
      rollupTypes: true,
      tsconfigPath: './tsconfig.app.json',
      outDir: outputDir,
      include: ['src']

    }),
    {
      name: 'bundle-declarations',
      closeBundle: () => {
        // Bundle the generated declaration bundle and the custom dojo-in-react.d.ts declaration into one file
        // TODO: should prefarably use internal rollup functions to merge the declaration files
        try {
          const dojoInReactCustomDeclarations = readFileSync(path.resolve(__dirname,'src/dojo-in-react.d.ts'), 'utf8');
          const generatedDeclarations = readFileSync(`${outputDir}/bundle.es.d.ts`, 'utf8');
          
          const mergedDeclarations = `${generatedDeclarations}\n\n${dojoInReactCustomDeclarations}`;
          writeFileSync(path.resolve(__dirname, outputDir, './bundle.es.d.ts'), mergedDeclarations, 'utf8');
        } catch (error) {
          console.error('Error merging .d.ts files:', error);
        }
      },
    },
    react()
  ],
  build: {
    outDir: 'artifacts',
    lib: {
      entry: 'src/index.ts',
      name: 'DojoInReact', // Global variable name
      formats: ['es', 'cjs'], // Output as ES module and CommonJS
      fileName: (format) => `${BUNDLE_NAME}.${format}.js`
    },
    rollupOptions: {
      // Externalize dependencies we don't want bundled
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});
