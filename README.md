# LookingForGroup

- [Getting Started](#getting-started)
- [Running the Project](#running-the-project)
- [Linting](#linting)
- [Formatting](#formatting)

## Getting Started

Navigate to the [root](.) directory and install dependencies:

```bash
npm install
```

This installs all the dependencies for the client and server projects, along with installing husky for our pre-commit checks. You only need to run this command in the [root](.) directory on clone, but if a new package is added to [package.json](package.json), you will need to run it again.

## Running the Project

### Development

To run in dev mode, all you need to do is run the following command in the [root](.) directory:

```bash
npm run dev
```

This will concurrently start a build watch on the client project, and run nodemon on the server. That means whenever a change is saved in the client, the HTML/CSS/JS will be rebuilt, and the server will then refresh to use these new files. That same thing happens to the server, where when a change is saved, it is refreshed to feature those changes.

## Linting

Both our client and server are set up with ESLint based linting. In addition, both have type checking powered by the typescript compiler.

### Server

For the server, as the code is vanilla JS, the code doesn't require compilation, but can be typechecked with the typescript compiler. Editors like VSCode should automatically highlight these errors for you, but the following command can be ran in [root](.) to manually typecheck:

```bash
npm run lint:server:types
```

The server also has ESLint based linting. To fix any fixable errors, and display the rest, the following command can be run in [root](.):

```bash
npm run lint:server
```

### Client

The client is written with typescript, so there is no dedicated typechecking command, but ESLint can be used to fix any fixable errors, and display the rest with the following command in [root](.):

```bash
npm run lint:client
```

## Formatting

Currently, only the server has Prettier powered formatting. The server code can be formatted by running the following command in [root](.):

```bash
npm run format:server
```
