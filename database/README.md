# Database docker setup

This is an docker based alternative to downloading the software directly onto your PC! All you need to do is create the image/container, then run it whenever you are working.

> [!Warning]
> Do not share the image with anyone else, as it is a mock of the live database and may contain information that should not be shared.

## Requirements

The only requirements to use this over the MySQL installer is Docker itself, however, if you aren't familiar with the Docker CLI tool, [Docker Desktop](https://www.docker.com/) is recommended. Your editor might have Docker extensions that you can use too, so it might be beneficial to check for those.

## Setup

1. Install docker if you haven't already
2. Download the database dump file from the server
3. Rename the file to `dump.sql` and place it in the [database directory](.)
4. Build the image with the CLI or an editor extension shortcut

## Usage

Once the image is built, you can spin up the container, but need the following parameters to be passed in:

- MYSQL_ROOT_PASSWORD - This is an env variable that tells MySQL what the password will be
- Host port - This should be the default MySQL port of 3306, but can be changed if needed (this would require changing the port in the express server too though)
