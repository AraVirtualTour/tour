# Build
FROM node:12.2.0-alpine as build

WORKDIR /app/tour
ENV PATH /app/tour/node_modules/.bin:$PATH
COPY tour/package.json /app/tour/package.json
RUN npm install --silent
RUN npm install react-app-rewired@2.1.5 -g --silent

COPY ./tour /app/tour
RUN npm run build

WORKDIR /app/game
ENV PATH /app/tour/node_modules/.bin:$PATH
COPY game/package.json /app/game/package.json
RUN npm install --silent

COPY ./game /app/game
RUN npm run build

# Production
EXPOSE 80
FROM nginx:1.16.0-alpine
COPY --from=build /app/tour/build /usr/share/nginx/html
COPY --from=build /app/game/build /usr/share/nginx/html/defend
RUN rm /etc/nginx/conf.d/default.conf
COPY tour/nginx/nginx.conf /etc/nginx/conf.d
CMD ["nginx", "-g", "daemon off;"]
