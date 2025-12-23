FROM node:22-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npm run migration:run && node dist/main"] 