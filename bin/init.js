#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE = path.resolve(__dirname, '../webshorts.config.js');
const DEST = path.resolve(process.cwd(), 'webshorts.config.js');

// Dependencies to install
const DEPENDENCIES = ['@radix-ui/react-dialog', 'sonner'];

// Check if package.json exists
const packageJsonPath = path.resolve(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ No package.json found in this directory. Please run this command from your project root.');
  process.exit(1);
}

// Check if config already exists
if (fs.existsSync(DEST)) {
  console.error('webshorts.config.js already exists in this directory. Aborting.');
  process.exit(1);
}

try {
  // Copy the config file
  fs.copyFileSync(TEMPLATE, DEST);
  console.log('✅ webshorts.config.js has been created in your project root!');

  // Install dependencies
  console.log('📦 Installing required dependencies...');

  // Check which package manager to use
  let packageManager = 'npm';
  if (fs.existsSync(path.resolve(process.cwd(), 'yarn.lock'))) {
    packageManager = 'yarn';
  } else if (fs.existsSync(path.resolve(process.cwd(), 'pnpm-lock.yaml'))) {
    packageManager = 'pnpm';
  }

  // Install dependencies
  const installCommand = packageManager === 'npm' ? `npm install ${DEPENDENCIES.join(' ')}` : packageManager === 'yarn' ? `yarn add ${DEPENDENCIES.join(' ')}` : `pnpm add ${DEPENDENCIES.join(' ')}`;

  try {
    execSync(installCommand, { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully!');
  } catch (installError) {
    console.warn('⚠️  Failed to install dependencies automatically. Please install them manually:');
    console.log(`   ${installCommand}`);
    console.log('\n   Or install them individually:');
    DEPENDENCIES.forEach((dep) => console.log(`   npm install ${dep}`));
  }

  console.log('\n🎉 WebShorts is ready to use!');
  console.log('   - Add WebShortsProvider to your app');
  console.log('   - Use ShortcutListener to register shortcuts');
  console.log('   - Press Shift + ? to open the help dialog');
  console.log('\n📝 Example:');
  console.log('   import { WebShortsProvider, WebShortsDialog } from "@chrisnski/webshorts";');
} catch (err) {
  console.error('❌ Failed to create webshorts.config.js:', err.message);
  process.exit(1);
}
