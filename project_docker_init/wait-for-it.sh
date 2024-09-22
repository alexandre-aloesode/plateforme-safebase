#!/usr/bin/env bash

# Usage: ./wait-for-it.sh host:port [-t timeout] [-- command args]
# Example: ./wait-for-it.sh auth_db:3306 -- echo "DB is ready"

HOST=$1
PORT=$2
TIMEOUT=${3:-30}

for i in $(seq 1 $TIMEOUT); do
    nc -z $HOST $PORT && echo "$HOST:$PORT is available" && break
    echo "Waiting for $HOST:$PORT..."
    sleep 1
done

if [ "$i" -eq "$TIMEOUT" ]; then
    echo "Timeout reached while waiting for $HOST:$PORT"
    exit 1
fi

shift 2
exec "$@"
