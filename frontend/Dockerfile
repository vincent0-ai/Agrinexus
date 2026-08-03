# Stage 1: Build the Vite React Frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy full application source
COPY . .

# Build-time argument for Vite API base URL
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build production assets
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:1.25-alpine AS runner

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
