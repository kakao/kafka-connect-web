#!/bin/sh

ROOT_DIR=/app/dist

for file in $ROOT_DIR/js/app.*.js* ;
do
  sed -i 's|VUE_APP_CONNECT_SERVERS_DOCKER_ENV|'${VUE_APP_CONNECT_SERVERS}'|g' $file
  sed -i 's|VUE_APP_AUTH_USERNAME_DOCKER_ENV|'${VUE_APP_AUTH_USERNAME}'|g' $file
  sed -i 's|VUE_APP_AUTH_PASSWORD_DOCKER_ENV|'${VUE_APP_AUTH_PASSWORD}'|g' $file
done

http-server dist