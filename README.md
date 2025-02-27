# LookingForGroup

- [Getting Started](#getting-started)
- [Running the Project](#running-the-project)
- [Linting and Formatting](#linting-and-formatting)

## Getting Started

1. Navigate to the root folder and install dependencies:

```bash
npm install
```

2. Navigate to the `client` folder and install its dependencies:

```bash
cd client
npm install
```

## Running the Project

- Frontend Only (HTML & CSS):

```bash
npm run client
## or
cd client
npm run start
```

- Backend & API (including database):

```bash
npm run server
```

- Running both frontend and backend together:

```bash
npm run dev
## or
npm run server
cd client
npm run start
```

## Linting and Formatting

### Linting
Run ESLint to check for issues:

```bash
npm run lint
```

To automatically fix issues:

```bash
npm run lint:fix
```

### Formatting
Format code using Prettier:

```bash
npm run format
```



