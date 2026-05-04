FROM mcr.microsoft.com/playwright:v1.57.0-noble

WORKDIR /app

COPY  package*.json ./

RUN npm ci

RUN npx playwright install chrome

COPY . .

CMD [ "npx", "playwright", "test" ]