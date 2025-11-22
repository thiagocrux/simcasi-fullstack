export default {
  "*.{js,ts,mjs,mts}": (filenames) => [
    `npx prettier --write ${filenames.map((filename) => `"${filename}"`).join(" ")}`,
    // 'eslint . --fix --ignore-pattern "dist/*"',
    // config testing routine...,
  ],
};
