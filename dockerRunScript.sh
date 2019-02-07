#!/usr/bin/env bash
currentFilePath=${BASH_SOURCE[0]}
docker exec -it $1 /bin/sh
