FROM node:18

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./
RUN npm install

# Copy all source files
COPY . .

# Create directory for database
RUN mkdir -p /app/backend

# Environment variables
ENV DB_PATH=/app/backend/eventmanagement.db
ENV NODE_ENV=development

# Expose ports (frontend + backend)
EXPOSE 5174 3002

# Start both frontend dev server and backend
CMD ["sh", "-c", "npm run dev & node server.js"]