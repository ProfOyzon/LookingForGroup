# Dockerfile that builds the Express API image

# Base Nodejs install
FROM node:24-slim as base

# Generate the generated prisma client files
FROM base as prisma-client

# Download only the production dependencies
FROM base as prod-deps

# Copy source files over
FROM base as source-files

# Final stage where app will run
FROM base as runner
