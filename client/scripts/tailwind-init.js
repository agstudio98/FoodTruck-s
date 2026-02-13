#!/usr/bin/env node
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tailwindPath = path.resolve(__dirname, '../node_modules/tailwindcss/lib/cli.js');

spawn('node', [tailwindPath, 'init', '-p'], { stdio: 'inherit' });
