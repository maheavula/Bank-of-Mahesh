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

EXPOSE 5173 3000

CMD ["npm", "run", "dev"]
