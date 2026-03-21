# Multi-stage build for AuditEngine
# Stage 1: Builder
FROM node:20-alpine AS builder

RUN apk add --no-cache git python3 make g++ curl

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY vite.config.js ./
COPY tsconfig.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY public ./public
COPY database ./database

# Build application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

# Install security updates
RUN apk add --no-cache curl dumb-init && \
    apk update && \
    apk upgrade && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Expose ports
EXPOSE 3000 5173

# Start application
ENTRYPOINT ["/sbin/dumb-init", "--"]
CMD ["npm", "run", "dev"]
