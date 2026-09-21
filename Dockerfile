FROM node:18-alpine

WORKDIR /app

# Copy package manifests first for better layer caching
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies for the root app, client, and server
RUN npm install \
  && npm --prefix client install \
  && npm --prefix server install

# Copy the application source after dependencies are installed
COPY . .

# Vite serves the UI on 5173; Express serves the API on 5000.
EXPOSE 5173 5000

# The client script already binds Vite to 0.0.0.0:5173 and proxies /api to
# the Express server on 127.0.0.1:5000 inside this container.
ENV PORT=5000
ENV CLIENT_URL=http://localhost:5173

CMD ["npm", "run", "dev"]
