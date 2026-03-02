// ============================================================================
// lint-staged Configuration
// ============================================================================
//
// This file configures lint-staged, a tool that runs linters on Git staged
// files before each commit. It ensures code quality standards are met and
// tests pass before changes are committed to the repository.
//
// Learn more: https://github.com/okonet/lint-staged
//
// ============================================================================

const config = {
  // Match TypeScript and JavaScript files staged for commit.
  '*.{js,ts,mjs,mts}': (filenames) => [
    // Format staged files with Prettier to ensure consistent code style.
    `npx prettier --write ${filenames.map((filename) => `"${filename}"`).join(' ')}`,

    // Lint and auto-fix staged files with ESLint to catch code quality issues.
    `npx eslint --fix ${filenames.map((filename) => `"${filename}"`).join(' ')}`,

    // Run tests matching the staged files to ensure functionality is not broken.
    // --passWithNoTests allows commit if no tests exist for the file.
    `pnpm test --testPathPattern=${filenames.map((f) => f.replace(/\\/g, '/')).join('|')} --passWithNoTests`,
  ],
};

export default config;
