FROM node:20 as build

WORKDIR /app
COPY . ./frontend

RUN cd frontend && npm install && npm run build

FROM nginx:alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
