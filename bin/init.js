#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE = path.resolve(__dirname, '../webshorts.config.js');
const DEST = path.resolve(process.cwd(), 'webshorts.config.js');

if (fs.existsSync(DEST)) {
  console.error('webshorts.config.js already exists in this directory. Aborting.');
  process.exit(1);
}

try {
  fs.copyFileSync(TEMPLATE, DEST);
  console.log('✅ webshorts.config.js has been created in your project root!');
} catch (err) {
  console.error('❌ Failed to create webshorts.config.js:', err.message);
  process.exit(1);
}
