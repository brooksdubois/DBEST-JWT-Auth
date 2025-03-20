import { defineConfig } from '@solidjs/start/config';

export default defineConfig({
  //ssr: false,
  middleware: "src/utils/logger.ts",
  server: {
    preset: 'bun',
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },
});
