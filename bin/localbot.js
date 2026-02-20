#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const distPath = path.join(__dirname, '..', 'dist', 'index.js');

if (fs.existsSync(distPath)) {
  require(distPath);
} else {
  console.error('Error: Build directory not found. Please run "npm run build" first.');
  console.error('Or use development mode: npm run dev');
  process.exit(1);
}
