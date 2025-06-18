// Lint staged config file
// When npx lint-staged is ran by husky on git a git commit
// Staged files that mach the pattern will have the commands executed on them
// Once we want to add it back, add this command to the front of the array 'pnpm --filter=server eslint --fix'
export default {
  server: ["pnpm --filter=server prettier --write"],
};
