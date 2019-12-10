# Build
FROM node:12.2.0-alpine as build

WORKDIR /app/tour
ENV PATH /app/tour/node_modules/.bin:$PATH
COPY package.json /app/tour/package.json
RUN npm install --silent
RUN npm install react-app-rewired@2.1.5 -g --silent

COPY . /app/tour
RUN npm run build

# Production
EXPOSE 80
FROM nginx:1.16.0-alpine
COPY --from=build /app/tour/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
CMD ["nginx", "-g", "daemon off;"]
