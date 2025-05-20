# 1. Base image
FROM node:20-alpine AS builder

# 2. Set working directories
WORKDIR /app

# # 3. Build frontend
# COPY client ./client
# WORKDIR /app/client
# RUN npm install
# RUN npm run build

# 4. Build backend
WORKDIR /app
COPY backend ./backend
WORKDIR /app/backend
# COPY --from=builder /app/client/dist ./public  # Move built frontend to backend
RUN npm install

# 5. Run backend (serves frontend too)
CMD ["npm", "start"]