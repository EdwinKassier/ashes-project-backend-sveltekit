# =============================================
# Build Stage
# =============================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci --include=dev

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build SvelteKit app
RUN npm run build

# Prune dev dependencies after build
RUN npm prune --production

# =============================================
# Production Stage
# =============================================
FROM node:18-alpine AS production

# Add non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S sveltekit -u 1001

WORKDIR /app

# Copy production build
COPY --from=builder --chown=sveltekit:nodejs /app/build ./build
COPY --from=builder --chown=sveltekit:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=sveltekit:nodejs /app/package.json ./package.json
COPY --from=builder --chown=sveltekit:nodejs /app/prisma ./prisma

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Switch to non-root user
USER sveltekit

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Open port
EXPOSE 3000

# Start the application
CMD ["node", "build"]