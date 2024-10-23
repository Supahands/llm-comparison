# Docker image for all deployment environments
# Use for production and staging
FROM node:20-alpine

ARG ENV_FILE

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy package.json and yarn.lock to install dependencies
COPY package.json package-lock.json ./

RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Copy the environment file
COPY .env.production .env
COPY .env.local .env.local

# Build the application and clean the cache to reduce the image size
RUN npm run build && npm cache clean --force

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]