# LookingForGroup

- [Getting Started](#getting-started)
- [Development](#Development)
- [Linting](#linting)
- [Formatting](#formatting)

## Getting Started

To get started, you can clone the repo, then follow the next steps.

### Install Node dependencies

To do this, navigate to the [root](.) directory run the following command:

```bash
npm install
```

This installs all the dependencies for the client and server projects. It also installs Husky for our pre-commit checks, and generates the Prisma client library for the back-end. You only need to run this command in the [root](.) directory on clone, but if a new package is added to any of the [package.json](package.json) files, or the [Prisma schema](./server/prisma/schema.prisma) is updated you will need to run it again.

> [!CAUTION]
> The `node_modules` directory should never be committed to git or any other version control system

### Set environment variables

Environment files allow for sensitive info to be given to the app without adding it to git. These environment variables are stored in `.env` files that must be places in the [server](./server/) and [client](./client/) directories.

> [!CAUTION]
> Environment files like `.env` should never be committed to git or any other version control system

#### Server `.env` example:

```sh
NODE_ENV=development
DATABASE_URL="mysql://<user>:<password>@localhost:<port>/lfg"
PORT=3000
```

- NODE_ENV should be `development` when working locally
- Replace `<user>` with the mysql username
- Replace `<password>` with the mysql password
- Replace `<port>` with the port the mysql server is running on
- PORT can be set to any open port you want, `3000` is standard for development

#### Client `.env` example

```sh
API_PORT=3000
```

- API_PORT is used by the vite proxy, and should match the `PORT` value used in the server `.env` file

## Development

### Running the project

To run in dev mode, all you need to do is run the following command in the [root](.) directory:

```bash
npm run dev
```

This will concurrently start the client project dev server, and run nodemon on the server. This means when the client is changed, it will hot reload. The same happens with the server. The client dev server also creates a proxy to the express server, so you can go to `localhost:{port the client is running on}/api` and reach the server.

### Husky pre-commit checks

Once you go to commit a file, you might notice it takes a bit longer than normal. That is because of [Husky](https://typicode.github.io/husky/), which allows us to run code when you go to commit. The config file for which files get what commands run on them is [.lintstagedrc.js](./.lintstagedrc.js).

#### Husky for the server

For server files, Husky will check them with ESLint, then with Prettier.

If your commit fails with an ESLint error, take a look back through your code to see if there are any missed ESLint errors that you need to fix.

If a Prettier error occurs, check to make sure your files don't have any syntax errors. Also make sure that if you are adding a new file type that isn't supported by Prettier, you update the [Prettier Ignore](./server/.prettierignore) to include it.

## Linting

Both our client and server are set up with ESLint based linting. In addition, both have type checking powered by the typescript compiler.

### Server

For the server, the code is a lightweight version of typescript that runs on node. This means it doesn't require compilation, but can be typechecked with the typescript compiler. Editors like VSCode should automatically highlight these errors for you, but the following command can be ran in [root](.) to manually typecheck:

```bash
npm run lint:server:types
```

The server also has ESLint based linting. To fix any fixable errors, and display the rest, the following command can be run in [root](.):

```bash
npm run lint:server
```

### Client

The client uses full typescript that must be transpiled and bundled for browsers. Vite will not perform typechecking, but your code editor should be able to highlight any type errors for you. If you want to run a manual typecheck, the following command can be run in [root](.):

```bash
npm run lint:client:types
```

The client also has ESLint based linting. To fix any fixable errors, and display the rest, the following command can be run in [root](.):

```bash
npm run lint:client
```

## Formatting

Currently, only the server has Prettier powered formatting. The server code can be formatted by running the following command in [root](.):

```bash
npm run format:server
```
