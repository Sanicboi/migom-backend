FROM node:alpine
WORKDIR /app
COPY ./package*.json ./
COPY ./tsconfig.json ./
RUN npm install
EXPOSE 80
CMD [ "npm", "start" ]