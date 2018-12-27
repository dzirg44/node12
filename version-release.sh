#!/bin/bash

TAG=$(git describe --abbrev=0 --tags)
COMMIT=$(git rev-parse --short HEAD)
BRANCH=$(git rev-parse --abbrev-ref HEAD)
TIME=$(date +%Y%m%d%H%M)
echo $TAG
echo $COMMIT
echo $BRANCH
docker-compose  build --build-arg app_version_arg=${TAG} --build-arg app_commit_arg=${COMMIT} --build-arg app_branch_arg=${BRANCH} --build-arg app_time_arg=${TIME}