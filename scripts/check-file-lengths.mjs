import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const roots = ['src', 'tests', 'e2e', 'scripts'];
const codeExtensions = new Set(['.ts', '.tsx', '.css', '.mjs']);
const failures = [];

async function scan(path) {
  let entries;
  try { entries = await readdir(path, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    const file = join(path, entry.name);
    if (entry.isDirectory()) await scan(file);
    else if (codeExtensions.has(extname(file))) {
      const lineCount = (await readFile(file, 'utf8')).split(/\r?\n/).length;
      if (lineCount >= 500) failures.push(`${file}: ${lineCount}줄`);
    }
  }
}

await Promise.all(roots.map(scan));
if (failures.length) {
  console.error(`500줄 이상인 코드 파일이 있습니다:\n${failures.join('\n')}`);
  process.exit(1);
}
console.log('모든 코드 파일이 500줄 미만입니다.');
