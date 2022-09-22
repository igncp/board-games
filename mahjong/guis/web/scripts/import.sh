#!/usr/bin/env bash

set -e

FILE_PATH="$1"

echo "Importing $FILE_PATH"

docker compose exec -T db \
  mysql -u mahjong -pmahjong \
  --default-character-set=utf8 \
  mahjong \
    < "$FILE_PATH"

echo "Imported $FILE_PATH"
