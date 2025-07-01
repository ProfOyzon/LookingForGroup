# MySQL Docker setup

This is an Docker based alternative to downloading MySQL directly onto your PC! This guide will walk you through building the MySQL image with the LFG database already set up for you.

> [!IMPORTANT]
> With the exception of the SQL dump file, all files mentioned are provided in the [database directory](.).
>
> You do **NOT** need to create your own Dockerfile or any new files in this process.

## Requirements

Docker is the only piece of required software to follow this guide. The easiest way to get everything you need is [Docker Desktop](https://www.docker.com/products/docker-desktop/), which is available on all platforms.

> [!TIP]
> The VSCode Docker extension can be helpful for building the image and monitoring the container. I recommend getting it [here](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker).

## Usage

### Building the image

1. Install Docker if you haven't already
2. Download the database dump file from the server
3. Rename the file to `dump.sql` and place it in the [database directory](.)
4. Build the provided [Dockerfile](Dockerfile) into an image
   - This can be done by right clicking it, then selecting `build image` if you have the VSCode extension
   - You can also run this command in the [root directory](../): `npm run build:database`

> [!CAUTION]
> The image you built should not be shared/published, as it may contain sensitive data that should not be made public.

### Running the container

1. Navigate to the Docker Desktop images tab
2. Click the play button for the `lookingforgroup` image
3. Open optional settings
4. Enter a port value
   - This will be the port the database can be accessed from
   - Make sure this value corresponds with the `DB_PORT` value in your [.env file](../.env)
   - `3306` is the default for MySQL, so it should be safe to use
5. Add an environment variable named `MYSQL_ROOT_PASSWORD`
   - This will be the password for the DB root user
   - Make sure this value corresponds with the `DB_PASS` value in your [.env file](../.env)
6. Click run!

## Final notes

Congrats, you now have the database running in a container! The database will be accessible as long as the container is running, and all data added will persist in the container.

> [!IMPORTANT]  
> If a new db dump is made, the image must be rebuilt. The old image and container can be deleted at this time.

### Starting the container

When you need to connect to the database, you can run the container with the start button from VSCode or Docker Desktop.

### Stopping the container

Once you are done using the database, the container can be stopped from VSCode or Docker Desktop. You can also stop Docker from running when you don't need the container for a while, as it will use ram.
