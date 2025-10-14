import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import { loadEnv } from 'vite';

// Needed because we're in an ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Accept mode as CLI argument (e.g. `staging`)
const mode = process.argv[2] || 'production';
console.log(`mode: ${mode}`);

const env = loadEnv(mode, __dirname, 'VITE_');
console.log('env:', env);

const OUT_DIR = env.VITE_OUT_DIR || 'dist';
const zipFile = `${OUT_DIR}.zip`;

async function run() {
  if (fs.existsSync(zipFile)) {
    fs.unlinkSync(zipFile);
  }

  const output = fs.createWriteStream(zipFile);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`✅ ${zipFile} created (${archive.pointer()} bytes)`);

    if (fs.existsSync(OUT_DIR)) {
      fs.rmSync(OUT_DIR, { recursive: true, force: true });
      console.log(`🗑️ ${OUT_DIR} folder deleted`);
    }
  });

  archive.on('error', (err: any) => { throw err; });

  archive.pipe(output);
  archive.directory(OUT_DIR, OUT_DIR); // include folder in zip
  await archive.finalize();
}

run().catch((err) => {
  console.error('❌ Error:', err);
});
