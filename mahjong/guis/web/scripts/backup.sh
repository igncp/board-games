#!/usr/bin/env bash

set -e

docker compose exec db \
  mysqldump --databases \
  --user=mahjong \
  --password=mahjong \
  mahjong \
    > backups/backup_$(date +"%Y%m%d_%H%M%S").sql

echo "Backup created"
