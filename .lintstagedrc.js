// Lint staged config file
// When npx lint-staged is ran by husky on git a git commit
// Staged files that mach the pattern will have the commands executed on them
export default {
  'server/**/*.js': ['eslint --fix', 'prettier --write'],
};
