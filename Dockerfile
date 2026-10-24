FROM node:24-alpine AS build
WORKDIR /site
COPY package*.json ./
RUN npm ci
COPY . .
RUN test -f src/content/docs/docs/index.mdx && npm run build && npm run verify
FROM nginx:alpine
COPY deploy/container-nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /site/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O /dev/null http://127.0.0.1/health.txt || exit 1
