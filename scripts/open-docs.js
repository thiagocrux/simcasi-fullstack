#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Opens the Scalar API documentation in the default browser.
 * Works cross-platform on Windows, macOS, and Linux.
 */

const { execSync } = require('child_process');
const http = require('http');
const os = require('os');

const BASE_URL = 'http://localhost:3000/api/docs';
const TIMEOUT = 30000; // 30 seconds
const RETRY_INTERVAL = 500; // 500ms between retries

/**
 * Checks if the server is running by making a test request
 */
function isServerReady() {
  return new Promise((resolve) => {
    const req = http.get(BASE_URL, { timeout: 2000 }, () => {
      resolve(true);
    });

    req.on('error', () => {
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Waits for the server to be ready, with timeout
 */
async function waitForServer() {
  const startTime = Date.now();

  while (Date.now() - startTime < TIMEOUT) {
    if (await isServerReady()) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
  }

  return false;
}

/**
 * Opens URL in the default browser (cross-platform)
 */
function openInBrowser(url) {
  const platform = os.platform();

  try {
    if (platform === 'darwin') {
      execSync(`open "${url}"`, { stdio: 'ignore' });
    } else if (platform === 'win32') {
      execSync(`start "" "${url}"`, { stdio: 'ignore', shell: true });
    } else {
      // Linux and other Unix-like systems
      execSync(`xdg-open "${url}"`, { stdio: 'ignore' });
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('⏳ Waiting for server to be ready...');

  const isReady = await waitForServer();

  if (!isReady) {
    console.error(
      '❌ Server is not responding. Make sure the dev server is running with "pnpm dev"'
    );
    process.exit(1);
  }

  console.log(`📖 Opening documentation at ${BASE_URL}...`);

  const opened = openInBrowser(BASE_URL);

  if (opened) {
    console.log('✅ Documentation opened in your browser!');
  } else {
    console.log(`⚠️  Could not open browser automatically.`);
    console.log(`   Please visit: ${BASE_URL}`);
  }
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
