FROM node:20
WORKDIR /app
COPY ./backend/package.json .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; \
    then npm install --only="production"; \
    else npm install; \
    fi

COPY ./backend .
ENV PORT 3000
EXPOSE $PORT
CMD [ "npm" , "run" , "dev" ]