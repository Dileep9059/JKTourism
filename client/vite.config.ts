import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, type PluginOption, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

import archiver from "archiver";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default defineConfig(({ mode, command }) => {

  const env = loadEnv(mode, __dirname, 'VITE_');
  const base = env.VITE_BASE || "/";
  const outDir = env.VITE_OUT_DIR || "dist";

  const plugins: PluginOption[] = [
    react(),
    tailwindcss(),
    {
      name: 'strip-inline-sourcemaps',
      apply: 'serve',
      enforce: 'post',
      transform(code, id) {
        if (id.endsWith('.js') || id.endsWith('.ts') || id.endsWith('.tsx')) {
          return {
            code: code.replace(/\/\/# sourceMappingURL=.*?(\r?\n|$)/g, ''),
            map: null,
          };
        }
      },
    },
    zipAfterBuild(outDir)
  ];

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

function zipAfterBuild(outDir: string) {
  return {
    name: "zip-after-build",
    closeBundle() {
      const zipName = `${outDir}.zip`;
      const output = fs.createWriteStream(zipName);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", () => {
        console.log(`✅ ${zipName} created (${archive.pointer()} bytes)`);
      });

      archive.on("error", (err: any) => {
        throw err;
      });

      archive.pipe(output);

      // keep the folder name inside zip
      archive.directory(outDir, path.basename(outDir));

      archive.finalize();
    },
  };
}