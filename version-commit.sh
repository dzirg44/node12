#!/bin/bash

TAG=$(git rev-parse --short HEAD)
echo $TAG
docker build --build-arg app_version_arg=$TAG .