FROM node:20-slim

WORKDIR /app

COPY . .

EXPOSE 5000

RUN npm install

RUN npm run build

CMD ["node", "dist/app/app.js"]
