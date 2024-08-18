import path from 'path';

const buildEslintCommand = (filenames) =>
  `npm run lint -- --fix ${filenames.map((f) => path.relative(process.cwd(), f)).join(' ')}`;

export default {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
};
