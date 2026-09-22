const path = require("path");

const buildNextEslintCommand = filenames => {
  const lintableFilenames = filenames.filter(
    filename => path.basename(filename) !== "next-env.d.ts",
  );

  if (lintableFilenames.length === 0) return [];

  return `yarn next:lint --fix ${lintableFilenames
    .map(filename => `--file ${path.relative("packages/nextjs", filename)}`)
    .join(" ")}`;
};

const checkTypesNextCommand = () => "yarn next:check-types";

module.exports = {
  "packages/nextjs/**/*.{ts,tsx}": [
    buildNextEslintCommand,
    checkTypesNextCommand,
  ],
};
