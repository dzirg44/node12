FROM node:10.12.0
ARG app_version_arg
ENV APP_VERSION=$app_version_arg
ARG app_commit_arg
ENV APP_COMMIT=$app_commit_arg
ARG app_branch_arg
ENV APP_BRANCH=$app_branch_arg
ARG app_time_arg
ENV APP_TIME=$app_time_arg

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY app.js .
COPY util.js .
EXPOSE ${PORT}
CMD ["npm", "start"]
