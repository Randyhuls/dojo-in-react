import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import path from 'path';
import fs from 'fs';

const dojoConfig = JSON.stringify(
  JSON.parse(fs.readFileSync(path.resolve(__dirname, './dojo.config.json'), 'utf-8'))
)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'vendor/**/*', dest: 'vendor' },
        { src: 'src/components/dojo/*', dest: 'dojo-widgets' },
      ],
    }),
    {
      name: 'inject-dojo-config',
      async transformIndexHtml(html) {
        return html.replace(
          '</main>',
          `</main>
          <script>window.dojoConfig = ${dojoConfig};</script>`        
        );
      },
    },
    react()
  ],
  define: {
    'import.meta.env.DOJO_CONFIG': dojoConfig
  }
});
