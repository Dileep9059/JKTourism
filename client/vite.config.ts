import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, type PluginOption, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default defineConfig(({ mode, command }) => {

  const env = loadEnv(mode, __dirname, 'VITE_');
  const base = env.VITE_BASE || "/";
  const outDir = env.VITE_OUT_DIR || "dist";

  const plugins: PluginOption[] = [
    react(),
    tailwindcss(),
  ];

  // Add source map stripper plugin only in dev
  if (command === 'serve') {
    plugins.push({
      name: 'strip-inline-sourcemaps',
      enforce: 'post',
      transform(code, id) {
        if (id.endsWith('.js') || id.endsWith('.ts') || id.endsWith('.tsx')) {
          return {
            code: code.replace(/\/\/# sourceMappingURL=.*?(\r?\n|$)/g, ''),
            map: null,
          };
        }
      },
    });
  }

  return {
    base,
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"), // <-- Add this line
      },
    },
    build: {
      outDir,
      sourcemap: false,
    },
    esbuild: {
      sourcemap: false, // prevent esbuild map generation
    },
    define: {
      __DEV__: command === 'serve',
    },
  };
});
